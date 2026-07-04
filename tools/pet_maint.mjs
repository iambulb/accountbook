#!/usr/bin/env node
// 🐾 펫 정리(런타임→정적 승격 + RTDB 정리) 오케스트레이터 — "펫 정리해줘" 루틴 전용.
//
// 목적: 매번 반복하던 수작업(RTDB 덤프·분류·매핑 작성·빌드·배포검증·RTDB 삭제)을 4개 서브커맨드로 묶어
//       토큰·시간·실수를 줄인다. Windows/Git Bash 게토(MSYS 경로변환·cp949)를 내부에서 처리한다.
//
// 흐름:
//   1) node tools/pet_maint.mjs pull      # RTDB 덤프 → 분류 리포트 + _sync/plan.json 템플릿 생성
//   2) (사람) _sync/plan.json 검토: promote 의 id 를 의미있는 <species>_<slug> 로, 새 종 라벨/설명 채움
//   3) node tools/pet_maint.mjs apply     # PNG 편입 + pets.json 병합 + 오버라이드 + 종라벨 + PET_ID_MIGRATE + build_pets.py + _sync/cleanup.json
//   4) (사람) git 커밋·푸시  → dev 자동배포
//   5) node tools/pet_maint.mjs verify    # 프로덕션 URL 의 sw 버전·새 PNG(200) 확인
//   6) node tools/pet_maint.mjs cleanup   # 배포 확인 후 RTDB 레코드 삭제(비가역)
//
// 관련: docs/pet-asset-pipeline.md, tools/build_pets.py, public/js/cats.js(PET_ID_MIGRATE·SPECIES_LABEL).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SYNC = path.join(REPO, '_sync');
const PETS_DIR = path.join(REPO, 'public', 'assets', 'pets');
const PETS_JSON = path.join(REPO, 'tools', 'pets.json');
const CATS_JS = path.join(REPO, 'public', 'js', 'cats.js');
const PROJECT = process.env.EGG_FB_PROJECT || 'money-bb658';
const PROD_URL = (process.env.EGG_PROD_URL || 'https://dev--fantastic-biscochitos-e3550e.netlify.app').replace(/\/$/, '');
const DIRS = ['walk', 'south', 'north', 'east', 'west'];
const RT = /^rt_/;                    // 런타임 펫 id 접두
const ANCHOR = '/* @rtmigrate */';    // PET_ID_MIGRATE 삽입 앵커

const C = { g: '\x1b[32m', y: '\x1b[33m', r: '\x1b[31m', d: '\x1b[2m', b: '\x1b[1m', x: '\x1b[0m' };
const say = (...a) => console.log(...a);
const hr = () => say(C.d + '─'.repeat(56) + C.x);

// ---------- 공용 헬퍼 ----------
function readJson(p, fb) { if (!fs.existsSync(p)) return fb; const t = fs.readFileSync(p, 'utf8').trim(); if (!t || t === 'null') return fb; return JSON.parse(t); }
function decodeDataUrl(s) { if (typeof s !== 'string' || !s) return null; const i = s.indexOf('base64,'); return Buffer.from(i >= 0 ? s.slice(i + 7) : s, 'base64'); }
// tools/pets.json 을 build_pets.py 의 save_reg 와 동일 포맷으로 직렬화(불필요한 diff 방지)
function serializeReg(reg) {
  const KEYS = ['id', 'species', 'name', 'tier', 'scale', 'desc', 'zip', 'frontWalk', 'frames'];
  const line = (p) => '    { ' + KEYS.filter(k => k in p).map(k => `"${k}": ${JSON.stringify(p[k])}`).join(', ') + ' }';
  const body = reg.pets.map(line).join(',\n');
  const out = {}; for (const k of Object.keys(reg)) if (k !== 'pets') out[k] = reg[k];
  return JSON.stringify(out, null, 2).slice(0, -2) + ',\n  "pets": [\n' + body + '\n  ]\n}\n';
}
function loadReg() { const r = readJson(PETS_JSON, null); if (!r || !Array.isArray(r.pets)) throw new Error('pets.json 파싱 실패'); return r; }
// firebase-tools 실행(Node 자식프로세스 → cmd.exe, MSYS 경로변환 없음). capture=true면 stdout 반환.
function fb(argStr, { capture = false } = {}) {
  const r = spawnSync(`npx firebase-tools ${argStr}`, { cwd: REPO, shell: true, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', env: process.env });
  if (r.status !== 0) {
    const msg = (r.stderr || '') + (r.error ? r.error.message : '');
    if (/login|authenticate|token/i.test(msg)) throw new Error('Firebase 인증 필요 — 사용자에게 `! npx firebase-tools login` 요청');
    throw new Error(`firebase-tools 실패(${r.status}): ${msg.slice(0, 300)}`);
  }
  return r.stdout || '';
}
function fbGet(rtdbPath, outFile) { fb(`database:get ${rtdbPath} --project ${PROJECT} -o "${outFile}"`); }

// ---------- pull: 덤프 + 분류 + plan 템플릿 ----------
function suggestId(species, rtId, taken) {
  let base = `${species}_${rtId.replace(RT, '')}`, id = base, n = 2;
  while (taken.has(id)) id = `${base}${n++}`;
  taken.add(id); return id;
}
function diffFields(rtMeta, base) {
  const d = {};
  for (const k of ['name', 'species', 'tier', 'scale']) {
    if (rtMeta[k] !== undefined && String(rtMeta[k]) !== String(base[k] ?? (k === 'scale' ? 1 : ''))) d[k] = rtMeta[k];
  }
  return d;
}
function cmdPull(force) {
  fs.mkdirSync(SYNC, { recursive: true });
  say(`${C.b}RTDB 덤프…${C.x} (project ${PROJECT})`);
  fbGet('/catalogPets', path.join(SYNC, 'catalogPets.json'));
  fbGet('/catalogPetArt', path.join(SYNC, 'catalogPetArt.json'));
  const meta = readJson(path.join(SYNC, 'catalogPets.json'), {}) || {};
  const art = readJson(path.join(SYNC, 'catalogPetArt.json'), {}) || {};
  const reg = loadReg();
  const known = new Set(reg.pets.map(p => p.id));
  const taken = new Set(known);
  const promote = {}, overrides = {}, softDeleted = [], warn = [];
  const speciesLabels = {};

  for (const [id, p] of Object.entries(meta)) {
    if (p.deleted) { softDeleted.push(id); continue; }
    if (RT.test(id)) {
      const species = String(p.species || 'cat').toLowerCase();
      const hasArt = (art[id] && DIRS.some(d => art[id][d])) || DIRS.some(d => typeof p[d] === 'string' && p[d].length > 50);
      if (!hasArt) { warn.push(`${id}: 이미지 없음(승격 불가) — 건너뜀`); continue; }
      const sid = suggestId(species, id, taken);
      promote[id] = { id: sid, species, name: p.name || sid, tier: p.tier || 'normal', scale: (p.scale != null ? p.scale : 1), desc: p.desc || '', frames: (p.frames != null ? Number(p.frames) : 6) };
      if (!reg.speciesLabel[species]) speciesLabels[species] = '';   // 새 종 → 라벨 채우기 필요
    } else {
      const base = reg.pets.find(x => x.id === id);
      if (!base) { warn.push(`${id}: rt_ 아님·pets.json 에도 없음 — 확인 필요`); continue; }
      const d = diffFields(p, base);
      if (Object.keys(d).length) overrides[id] = d;
    }
  }

  const planPath = path.join(SYNC, 'plan.json');
  const plan = { promote, overrides, speciesLabels, softDeleted };
  if (fs.existsSync(planPath) && !force) {
    say(`${C.y}plan.json 이미 있음 — 유지(덮어쓰려면 --force)${C.x}`);
  } else {
    fs.writeFileSync(planPath, JSON.stringify(plan, null, 2) + '\n');
  }

  // 리포트
  hr();
  say(`${C.b}승격 대상(런타임 펫) ${Object.keys(promote).length}종${C.x}`);
  for (const [rt, c] of Object.entries(promote)) say(`  ${rt}  →  ${C.g}${c.id}${C.x}  (${c.name} · ${c.species} · ${c.tier}${c.scale != 1 ? ' · x' + c.scale : ''})`);
  if (Object.keys(overrides).length) { say(`\n${C.b}정적 펫 편집(오버라이드) ${Object.keys(overrides).length}종${C.x}`); for (const [id, d] of Object.entries(overrides)) say(`  ${id}: ${JSON.stringify(d)}`); }
  if (Object.keys(speciesLabels).length) { say(`\n${C.y}새 종 — plan.json speciesLabels 에 한글 라벨을 채우세요:${C.x}`); for (const s of Object.keys(speciesLabels)) say(`  "${s}": ""   ← 예: "사자"`); }
  if (softDeleted.length) { say(`\n${C.d}soft-delete(자동 처리 안 함): ${softDeleted.join(', ')}${C.x}`); }
  if (warn.length) { say(`\n${C.y}경고:${C.x}`); warn.forEach(w => say('  ' + w)); }
  hr();
  say(`plan: ${path.relative(REPO, planPath)}`);
  say(`${C.b}다음:${C.x} plan.json 의 promote id 를 의미있는 <species>_<slug> 로 바꾸고${Object.keys(speciesLabels).length ? '·새 종 라벨 채우고' : ''} → ${C.g}node tools/pet_maint.mjs apply${C.x}`);
}

// ---------- apply: 정적 편입 + 코드/문서 재생성 ----------
function ensureSpeciesLabelInCats(cats, sp, label) {
  const m = cats.match(/const SPECIES_LABEL = \{([^}]*)\}/);
  if (!m) throw new Error('cats.js SPECIES_LABEL 을 찾지 못함');
  if (new RegExp(`\\b${sp}:`).test(m[1])) return cats;   // 이미 있음
  const inner = m[1].replace(/[\s,]*$/, '');
  return cats.replace(m[0], `const SPECIES_LABEL = {${inner}, ${sp}:'${label}' }`);
}
function cmdApply() {
  const meta = readJson(path.join(SYNC, 'catalogPets.json'), {}) || {};
  const art = readJson(path.join(SYNC, 'catalogPetArt.json'), {}) || {};
  const plan = readJson(path.join(SYNC, 'plan.json'), null);
  if (!plan) throw new Error('_sync/plan.json 없음 — 먼저 `pull` 실행');
  const reg = loadReg();
  let cats = fs.readFileSync(CATS_JS, 'utf8');
  if (!cats.includes(ANCHOR)) throw new Error(`cats.js 에 ${ANCHOR} 앵커 없음`);
  const cleanupKeys = [];
  const done = [];

  // 0) 새 종 라벨(pets.json + cats.js SPECIES_LABEL)
  for (const [sp, label] of Object.entries(plan.speciesLabels || {})) {
    if (!label) throw new Error(`새 종 "${sp}" 라벨이 비어있음 — plan.json speciesLabels 채우기`);
    reg.speciesLabel[sp] = label;
    cats = ensureSpeciesLabelInCats(cats, sp, label);
  }

  // 1) 승격
  for (const [rt, cfg] of Object.entries(plan.promote || {})) {
    const m = meta[rt] || {};
    const sid = cfg.id, species = String(cfg.species || m.species || 'cat').toLowerCase();
    if (!/^[a-z0-9]+_[a-z0-9_]+$/.test(sid)) throw new Error(`${rt}: id "${sid}" 형식이 <species>_<slug> 아님`);
    const src = art[rt] || m, outDir = path.join(PETS_DIR, species, sid);
    fs.mkdirSync(outDir, { recursive: true });
    let wrote = 0;
    for (const d of DIRS) { const buf = decodeDataUrl(src[d]); if (buf) { fs.writeFileSync(path.join(outDir, d + '.png'), buf); wrote++; } }
    if (!wrote) throw new Error(`${rt}(${sid}): 이미지 디코드 실패`);
    const entry = { id: sid, species, name: cfg.name || m.name || sid, tier: cfg.tier || m.tier || 'normal', scale: (cfg.scale != null ? cfg.scale : (m.scale != null ? m.scale : 1)), desc: cfg.desc || m.desc || '', zip: '', frontWalk: (cfg.frontWalk != null ? cfg.frontWalk : !!m.frontWalk), frames: (cfg.frames != null ? Number(cfg.frames) : (m.frames != null ? Number(m.frames) : 6)) };
    const i = reg.pets.findIndex(p => p.id === sid); if (i >= 0) reg.pets[i] = entry; else reg.pets.push(entry);
    if (!new RegExp(`\\b${rt}\\s*:`).test(cats)) { const at = cats.lastIndexOf(ANCHOR); cats = cats.slice(0, at) + `${rt}:'${sid}', ` + cats.slice(at); }
    cleanupKeys.push(`/catalogPets/${rt}`, `/catalogPetArt/${rt}`);
    done.push(`${rt} → ${sid}`);
  }

  // 2) 정적 오버라이드(name/tier/scale 등) 반영 + RTDB 오버라이드 삭제 대상
  for (const [id, edit] of Object.entries(plan.overrides || {})) {
    const p = reg.pets.find(x => x.id === id);
    if (!p) { say(`${C.y}오버라이드 ${id}: pets.json 에 없음 — 건너뜀${C.x}`); continue; }
    Object.assign(p, edit);
    cleanupKeys.push(`/catalogPets/${id}`);
    done.push(`override ${id}: ${JSON.stringify(edit)}`);
  }

  // 3) soft-delete 는 자동 삭제 안 함(소유자 보호). cleanup 에 넣지 않는다.

  fs.writeFileSync(PETS_JSON, serializeReg(reg));
  fs.writeFileSync(CATS_JS, cats);

  // 4) build_pets.py (Windows cp949 회피)
  say(`${C.b}build_pets.py 재생성…${C.x}`);
  const bp = spawnSync('python tools/build_pets.py', { cwd: REPO, shell: true, stdio: 'inherit', env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' } });
  if (bp.status !== 0) throw new Error('build_pets.py 실패');

  fs.writeFileSync(path.join(SYNC, 'cleanup.json'), JSON.stringify({ keys: cleanupKeys, promoted: plan.promote }, null, 2) + '\n');

  hr();
  done.forEach(d => say(`  ${C.g}✓${C.x} ${d}`));
  say(`\ncleanup 대상 ${cleanupKeys.length}경로 → _sync/cleanup.json 기록`);
  say(`${C.b}다음:${C.x} npm test → git 커밋·푸시(dev 자동배포) → ${C.g}node tools/pet_maint.mjs verify${C.x}`);
}

// ---------- verify: 프로덕션 배포 확인 ----------
async function cmdVerify() {
  const localVer = (fs.readFileSync(path.join(REPO, 'public', 'sw.js'), 'utf8').match(/eggarden-v[\d.]+/) || [])[0];
  say(`${C.b}프로덕션 확인:${C.x} ${PROD_URL}`);
  let ok = true;
  try {
    const sw = await (await fetch(`${PROD_URL}/sw.js`, { cache: 'no-store' })).text();
    const liveVer = (sw.match(/eggarden-v[\d.]+/) || ['?'])[0];
    const match = liveVer === localVer;
    say(`  sw.js: live=${match ? C.g : C.y}${liveVer}${C.x} / local=${localVer} ${match ? '✓' : '⏳(빌드 대기중일 수 있음)'}`);
    if (!match) ok = false;
  } catch (e) { say(`  ${C.r}sw.js 조회 실패: ${e.message}${C.x}`); ok = false; }

  const plan = readJson(path.join(SYNC, 'cleanup.json'), null) || readJson(path.join(SYNC, 'plan.json'), { promote: {} });
  const promo = plan.promoted || plan.promote || {};
  for (const c of Object.values(promo)) {
    try {
      const r = await fetch(`${PROD_URL}/assets/pets/${c.species}/${c.id}/walk.png`, { method: 'HEAD', cache: 'no-store' });
      say(`  ${c.species}/${c.id}/walk.png → HTTP ${r.status} ${r.status === 200 ? '✓' : (ok = false, '✗')}`);
    } catch (e) { say(`  ${c.id}: ${C.r}${e.message}${C.x}`); ok = false; }
  }
  hr();
  say(ok ? `${C.g}✅ 배포 확인됨 — RTDB 정리 안전:${C.x} node tools/pet_maint.mjs cleanup` : `${C.y}⏳ 아직 반영 안 됨 — 잠시 후 verify 재실행(빌드 1~2분)${C.x}`);
  process.exitCode = ok ? 0 : 1;
}

// ---------- cleanup: RTDB 삭제(비가역) ----------
function cmdCleanup() {
  const cu = readJson(path.join(SYNC, 'cleanup.json'), null);
  if (!cu || !cu.keys || !cu.keys.length) { say(`${C.y}_sync/cleanup.json 없음/비어있음 — apply 먼저${C.x}`); return; }
  say(`${C.b}RTDB 삭제(비가역) ${cu.keys.length}경로…${C.x}`);
  let fail = 0;
  for (const k of cu.keys) {
    try { fb(`database:remove ${k} --project ${PROJECT} -f`, { capture: true }); say(`  ${C.g}✓${C.x} ${k}`); }
    catch (e) { say(`  ${C.r}✗ ${k} — ${e.message}${C.x}`); fail++; }
  }
  // 확인
  try {
    const left = fb(`database:get /catalogPets --project ${PROJECT} --shallow`, { capture: true }).trim();
    say(`\ncatalogPets 남음: ${left === 'null' || !left ? C.g + '(비어있음)' + C.x : C.y + left + C.x}`);
  } catch { /* noop */ }
  hr();
  say(fail ? `${C.y}${fail}건 실패 — 위 오류 확인${C.x}` : `${C.g}✅ RTDB 정리 완료${C.x}`);
}

// ---------- main ----------
const cmd = process.argv[2];
const force = process.argv.includes('--force');
(async () => {
  try {
    if (cmd === 'pull') cmdPull(force);
    else if (cmd === 'apply') cmdApply();
    else if (cmd === 'verify') await cmdVerify();
    else if (cmd === 'cleanup') cmdCleanup();
    else {
      say(`${C.b}펫 정리 오케스트레이터${C.x}  (project ${PROJECT})\n`);
      say('  node tools/pet_maint.mjs pull      RTDB 덤프 → 분류 리포트 + _sync/plan.json 템플릿');
      say('  node tools/pet_maint.mjs apply     PNG 편입·pets.json·오버라이드·종라벨·PET_ID_MIGRATE·build_pets.py');
      say('  node tools/pet_maint.mjs verify    프로덕션(sw 버전·새 PNG) 배포 확인');
      say('  node tools/pet_maint.mjs cleanup   배포 확인 후 RTDB 레코드 삭제(비가역)');
      say(`\n환경변수: EGG_FB_PROJECT, EGG_PROD_URL 로 대상 변경 가능.`);
      say(`상세: docs/pet-asset-pipeline.md "주간 자동 정리".`);
    }
  } catch (e) { say(`${C.r}✗ ${e.message}${C.x}`); process.exitCode = 1; }
})();
