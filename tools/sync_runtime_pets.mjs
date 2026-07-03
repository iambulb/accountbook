#!/usr/bin/env node
// 런타임 펫 → 정적 승격 도구 (주간 "펫 정리해줘" 루틴에서 사용).
//
// 입력(기본 <repo>/_sync/ , --dir 로 변경):
//   catalogPets.json   = `firebase database:get /catalogPets` 결과(런타임 펫 메타 { rt_xxx:{...} })
//   catalogPetArt.json = `firebase database:get /catalogPetArt` 결과(스프라이트 { rt_xxx:{walk,south,north,east,west} = data URL })
//   promote.json       = 승격 매핑 { "rt_xxx": { "id":"cat_slug", "name":"…", "tier":"…", "scale":1, "desc":"…", "frontWalk":false } }
//                        (id·이름은 개발자가 배정. species·frontWalk·scale 등 생략 시 catalogPets 메타에서 채움)
//
// 동작(멱등):
//   1) 각 rt_id의 walk/south/north/east/west data URL을 디코드 → public/assets/pets/<species>/<static_id>/*.png 기록
//   2) tools/pets.json pets[]에 { id,species,name,tier,scale,desc,zip:"",frontWalk } 병합(같은 id 갱신)
//   3) public/js/cats.js PET_ID_MIGRATE 의 /* @rtmigrate */ 앞에 rt_id:'static_id' 삽입(중복 방지)
//   4) 승격 목록·경고·RTDB 삭제 키·미승격(soft-deleted/누락) 목록 출력
//
// 이후 파이프라인: `python tools/build_pets.py` → 커밋 → 배포 → 배포 확인 후 catalogPets/catalogPetArt 삭제.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const argDir = (() => { const i = process.argv.indexOf('--dir'); return i >= 0 ? process.argv[i + 1] : null; })();
const SYNC_DIR = argDir ? path.resolve(argDir) : path.join(REPO, '_sync');
const PETS_DIR = path.join(REPO, 'public', 'assets', 'pets');
const PETS_JSON = path.join(REPO, 'tools', 'pets.json');
const CATS_JS = path.join(REPO, 'public', 'js', 'cats.js');
const DIRS = ['walk', 'south', 'north', 'east', 'west'];

function readJson(p, fallback) {
  if (!fs.existsSync(p)) return fallback;
  const t = fs.readFileSync(p, 'utf8').trim();
  if (!t || t === 'null') return fallback;
  return JSON.parse(t);
}
function decodeDataUrl(s) {
  if (typeof s !== 'string' || !s) return null;
  const i = s.indexOf('base64,');
  const b64 = i >= 0 ? s.slice(i + 7) : s; // data URL 또는 순수 base64 모두 허용
  return Buffer.from(b64, 'base64');
}
// tools/pets.json 을 build_pets.py 의 save_reg 와 동일한 포맷으로 직렬화(불필요한 diff 방지)
function serializeReg(reg) {
  const KEYS = ['id', 'species', 'name', 'tier', 'scale', 'desc', 'zip', 'frontWalk'];
  const petline = (p) => '    { ' + KEYS.filter(k => k in p).map(k => `"${k}": ${JSON.stringify(p[k])}`).join(', ') + ' }';
  const body = reg.pets.map(petline).join(',\n');
  const out = {}; for (const k of Object.keys(reg)) if (k !== 'pets') out[k] = reg[k];
  let head = JSON.stringify(out, null, 2);
  head = head.slice(0, -2) + ',\n  "pets": [\n' + body + '\n  ]\n}\n';
  return head;
}

const meta = readJson(path.join(SYNC_DIR, 'catalogPets.json'), {}) || {};
const art = readJson(path.join(SYNC_DIR, 'catalogPetArt.json'), {}) || {};
const promote = readJson(path.join(SYNC_DIR, 'promote.json'), null);
if (!promote) {
  console.error(`✗ promote.json 이 없습니다: ${path.join(SYNC_DIR, 'promote.json')}`);
  console.error(`  먼저 catalogPets.json/catalogPetArt.json 을 ${SYNC_DIR} 에 두고, 승격할 펫 매핑을 promote.json 으로 작성하세요.`);
  process.exit(1);
}

const reg = readJson(PETS_JSON, null);
if (!reg || !Array.isArray(reg.pets)) { console.error(`✗ pets.json 파싱 실패: ${PETS_JSON}`); process.exit(1); }
let cats = fs.readFileSync(CATS_JS, 'utf8');
const ANCHOR = '/* @rtmigrate */';
if (!cats.includes(ANCHOR)) { console.error(`✗ cats.js 에 ${ANCHOR} 앵커가 없습니다. PET_ID_MIGRATE 에 앵커를 먼저 추가하세요.`); process.exit(1); }

const promoted = [];   // { rt, id, name }
const warnings = [];
const removeKeys = []; // RTDB 삭제 대상(배포 확인 후)

for (const [rt, cfg] of Object.entries(promote)) {
  const m = meta[rt];
  if (!m) { warnings.push(`${rt}: catalogPets 메타에 없음 → 건너뜀`); continue; }
  if (m.deleted) warnings.push(`${rt}: catalogPets 에 deleted=true 인데 promote.json 에 있어 승격함(확인)`);
  const sid = cfg.id;
  if (!sid || !/^[a-z0-9]+_[a-z0-9_]+$/.test(sid)) { warnings.push(`${rt}: id "${sid}" 형식이 <species>_<slug> 아님 → 건너뜀`); continue; }

  // 1) 이미지 기록 (catalogPetArt 우선, 없으면 메타 인라인 레거시)
  const species = cfg.species || m.species || 'cat';
  const src = art[rt] || m;
  const outDir = path.join(PETS_DIR, species, sid);   // 종별 하위폴더 assets/pets/<species>/<id>/
  fs.mkdirSync(outDir, { recursive: true });
  let wrote = 0;
  for (const d of DIRS) {
    const buf = decodeDataUrl(src[d]);
    if (!buf) { if (d === 'walk' || d === 'south') warnings.push(`${rt}(${sid}): ${d} 이미지 없음`); continue; }
    fs.writeFileSync(path.join(outDir, d + '.png'), buf);
    wrote++;
  }
  if (!wrote) { warnings.push(`${rt}(${sid}): 이미지가 하나도 없어 건너뜀`); continue; }

  // 2) pets.json 병합
  const entry = {
    id: sid,
    species,
    name: cfg.name || m.name || sid,
    tier: cfg.tier || m.tier || 'normal',
    scale: (cfg.scale != null ? cfg.scale : (m.scale != null ? m.scale : 1)),
    desc: cfg.desc || m.desc || '',
    zip: '',
    frontWalk: (cfg.frontWalk != null ? cfg.frontWalk : !!m.frontWalk),
  };
  const idx = reg.pets.findIndex(p => p.id === sid);
  if (idx >= 0) reg.pets[idx] = entry; else reg.pets.push(entry);

  // 3) PET_ID_MIGRATE 삽입(중복 방지). 앵커의 마지막 출현(코드) 앞에 삽입 — 주석이 앵커를 언급해도 안전.
  if (!new RegExp(`\\b${rt}\\s*:`).test(cats)) {
    const at = cats.lastIndexOf(ANCHOR);
    cats = cats.slice(0, at) + `${rt}:'${sid}', ` + cats.slice(at);
  }

  promoted.push({ rt, id: sid, name: entry.name });
  removeKeys.push(`catalogPets/${rt}`, `catalogPetArt/${rt}`);
}

// 쓰기
fs.writeFileSync(PETS_JSON, serializeReg(reg));
fs.writeFileSync(CATS_JS, cats);

// 리포트
const line = '─'.repeat(48);
console.log(line);
if (promoted.length) {
  console.log(`✓ 정적 승격 ${promoted.length}마리:`);
  for (const p of promoted) console.log(`   ${p.rt}  →  ${p.id}  (${p.name})`);
} else {
  console.log('· 승격된 펫 없음(promote.json 매핑을 확인하세요)');
}

// 미승격 활성 런타임 펫(놓치지 않게)
const activeNotPromoted = Object.keys(meta).filter(k => /^rt_/.test(k) && !meta[k].deleted && !promote[k]);
if (activeNotPromoted.length) {
  console.log(`\n⚠ 활성 런타임 펫인데 promote.json 에 없음(이번에 승격 안 됨):`);
  for (const k of activeNotPromoted) console.log(`   ${k}  (${meta[k].name || '?'} · ${meta[k].tier || '?'})`);
}
// soft-deleted(자동 삭제 안 함 — 소유자 있으면 깨질 수 있어 별도 확인)
const softDeleted = Object.keys(meta).filter(k => meta[k].deleted);
if (softDeleted.length) {
  console.log(`\nℹ 앱에서 삭제(soft-delete)된 런타임 펫 — 자동 처리 안 함(소유자 확인 후 수동 purge):`);
  for (const k of softDeleted) console.log(`   ${k}  (${meta[k].name || '?'})`);
}
if (warnings.length) { console.log('\n⚠ 경고:'); for (const w of warnings) console.log('   ' + w); }

if (removeKeys.length) {
  console.log('\n▶ 다음 단계: python tools/build_pets.py → npm test → 커밋·푸시 → 배포');
  console.log('  배포 확인 후 RTDB 삭제(비가역):');
  for (const k of removeKeys) console.log(`   npx firebase-tools database:remove /${k} --project money-bb658 -f`);
}
console.log(line);
