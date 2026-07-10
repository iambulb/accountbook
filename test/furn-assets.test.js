// 🧱 기구물 에셋 정합 정적 검증 — 2026-07-10 실제 장애(84b7c23) 재발 방지.
//   배경: furnMatrix()는 호출 시 객체 리터럴 전체를 평가하므로, 카탈로그/furnMatrix에 id가 있는데
//   cats.assets.js의 M_* 매트릭스가 (불완전 커밋·공유 인덱스 스윕으로) 빠지면 ReferenceError로
//   "가구를 그리는 모든 화면"(알뜰홈·개발자·도감·박스 리빌)이 통째로 죽는다.
//   이 테스트는 커밋 전 `node --test`에서 그 누락을 즉시 잡는다.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const JS_DIR = path.join(__dirname, '..', 'public', 'js');
function read(f) { return fs.readFileSync(path.join(JS_DIR, f), 'utf8'); }
// 주석 제거(라인·블록) — 주석 속 M_* 언급(예: "구 M_BOX_CAT은 제거됨")이 오탐되지 않게.
//   문자열 리터럴 내 '//'(URL 등)는 드물고 M_*를 담지 않아 실용상 안전.
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

const files = fs.readdirSync(JS_DIR).filter(f => f.endsWith('.js'));
const srcAll = files.map(f => stripComments(read(f))).join('\n');

test('furn-assets: 모든 M_* 참조는 정의가 있어야(불완전 커밋 → 전 가구 렌더 사망 방지)', () => {
  const defined = new Set([...srcAll.matchAll(/(?:const|let|var|function)\s+(M_[A-Z_0-9]+)/g)].map(m => m[1]));
  const refs = new Set([...srcAll.matchAll(/(?<![A-Za-z0-9_$])(M_[A-Z_0-9]+)/g)].map(m => m[1]));
  const missing = [...refs].filter(r => !defined.has(r)).sort();
  assert.deepStrictEqual(missing, [], '미정의 M_* 참조 발견 — cats.assets.js 매트릭스가 같은 커밋에 포함됐는지 확인: ' + missing.join(', '));
});

test('furn-assets: furnMatrix의 모든 가구 id는 FURN_PALS 팔레트 키를 가져야(렌더 크래시 방지)', () => {
  const cats = stripComments(read('cats.js'));
  const assets = stripComments(read('cats.assets.js'));
  const fm = cats.match(/function furnMatrix\(id\)\{ return \{([\s\S]*?)\}\[id\]; \}/);
  assert.ok(fm, 'furnMatrix 매핑을 찾지 못함(형식 변경 시 이 테스트 갱신)');
  const ids = [...fm[1].matchAll(/([a-z][a-z0-9]*)\s*:\s*M_[A-Z_0-9]+/g)].map(m => m[1]);
  assert.ok(ids.length > 50, 'furnMatrix id 추출 이상(개수 ' + ids.length + ')');
  const palsSrc = assets.includes('const FURN_PALS') ? assets : cats;
  const pi = palsSrc.indexOf('const FURN_PALS');
  assert.ok(pi >= 0, 'FURN_PALS 정의를 찾지 못함');
  const pline = palsSrc.slice(pi, palsSrc.indexOf('\n', pi));
  const palKeys = new Set([...pline.matchAll(/([a-z][a-z0-9]*)\s*:\s*(?:\{|[A-Z_])/g)].map(m => m[1]));
  const missing = ids.filter(id => !palKeys.has(id)).sort();
  assert.deepStrictEqual(missing, [], 'FURN_PALS에 팔레트가 없는 가구 id: ' + missing.join(', '));
});
