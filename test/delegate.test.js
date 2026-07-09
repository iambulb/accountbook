'use strict';
// 이벤트 델리게이션 순수 헬퍼 테스트 — public/js/delegate.js
// 실행: npm test (node --test). (브라우저 배선은 typeof window 가드라 Node에선 순수부만 로드됨)
const test = require('node:test');
const assert = require('node:assert');
const { coerceArg, readActionArgs, buildActionAttrs } = require('../public/js/delegate.js');

test('coerceArg — 타입 강제', () => {
  assert.strictEqual(coerceArg('5', 'n'), 5);
  assert.strictEqual(coerceArg('3.5', 'n'), 3.5);
  assert.strictEqual(coerceArg('true', 'b'), true);
  assert.strictEqual(coerceArg('1', 'b'), true);
  assert.strictEqual(coerceArg('0', 'b'), false);
  assert.deepStrictEqual(coerceArg('{"a":1}', 'j'), { a: 1 });
  assert.strictEqual(coerceArg('hello'), 'hello');          // 기본=문자열
  assert.strictEqual(coerceArg('42'), '42');                // 타입 없으면 문자열 유지
});

test('readActionArgs — data-a0.. 순서대로(접근자 주입)', () => {
  const attrs = { 'data-a0': '홍길동', 'data-a1': '1', 'data-t1': 'n' };
  const args = readActionArgs(n => attrs[n], n => Object.prototype.hasOwnProperty.call(attrs, n));
  assert.deepStrictEqual(args, ['홍길동', 1]);
});

test('readActionArgs — 인자 없음', () => {
  assert.deepStrictEqual(readActionArgs(() => null, () => false), []);
});

test('readActionArgs — 불리언/문자 혼합', () => {
  const attrs = { 'data-a0': 'x', 'data-a1': 'true', 'data-t1': 'b', 'data-a2': 'y' };
  const args = readActionArgs(n => attrs[n], n => Object.prototype.hasOwnProperty.call(attrs, n));
  assert.deepStrictEqual(args, ['x', true, 'y']);
});

test('buildActionAttrs — 무인자', () => {
  assert.strictEqual(buildActionAttrs('goHome', []), 'data-action="goHome"');
});

test('buildActionAttrs — 문자열 인자', () => {
  assert.strictEqual(buildActionAttrs('setMode', ['todo']), 'data-action="setMode" data-a0="todo"');
});

test('buildActionAttrs — 숫자는 data-t=n 자동', () => {
  assert.strictEqual(buildActionAttrs('moveCat', ['가', 1]), 'data-action="moveCat" data-a0="가" data-a1="1" data-t1="n"');
});

test('buildActionAttrs — {v,t} 명시 타입', () => {
  assert.strictEqual(buildActionAttrs('f', [{ v: 'true', t: 'b' }]), 'data-action="f" data-a0="true" data-t0="b"');
});

test('buildActionAttrs — null/undefined은 t=j(실제 null 복원)', () => {
  assert.strictEqual(buildActionAttrs('openTxSheet', [null, null, '2026-07-09']),
    'data-action="openTxSheet" data-a0="null" data-t0="j" data-a1="null" data-t1="j" data-a2="2026-07-09"');
});

test('round-trip — null 인자 복원(문자열 아님)', () => {
  const attrs = {};
  buildActionAttrs('f', [null, 'x']).replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => { attrs[k] = v; return _; });
  const args = readActionArgs(n => attrs[n], n => Object.prototype.hasOwnProperty.call(attrs, n));
  assert.strictEqual(args[0], null);       // 문자열 'null' 아님
  assert.strictEqual(args[1], 'x');
});

test('buildActionAttrs — attr=change 는 data-change (onchange 이관용)', () => {
  assert.strictEqual(buildActionAttrs('onCurChange', [], undefined, 'change'), 'data-change="onCurChange"');
  assert.strictEqual(buildActionAttrs('setX', ['a'], undefined, 'change'), 'data-change="setX" data-a0="a"');
});

test('buildActionAttrs — esc 주입(따옴표/꺾쇠 이스케이프 round-trip)', () => {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const out = buildActionAttrs('f', ['a"b<c'], esc);
  assert.strictEqual(out, 'data-action="f" data-a0="a&quot;b&lt;c"');
});

test('round-trip — build → read 일관', () => {
  // buildActionAttrs로 만든 뒤 읽으면 원 인자 복원(숫자 타입 포함)
  const attrs = {};
  const built = buildActionAttrs('act', ['이름', 3, true]);
  built.replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => { attrs[k] = v; return _; });
  const args = readActionArgs(n => attrs[n], n => Object.prototype.hasOwnProperty.call(attrs, n));
  assert.deepStrictEqual(args, ['이름', 3, true]);
});
