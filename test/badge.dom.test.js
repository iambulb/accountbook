'use strict';
// 배지 DOM 반영(applyHomeBadge/applyTodoTabDot) 노드 레벨 검증 — jsdom으로 실제 DOM 조작을 확인.
// 실행: npm test (node --test). jsdom은 devDependency.
const test = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const U = require('../public/js/util.js');

function makeDoc() {
  const dom = new JSDOM(
    '<!DOCTYPE html><body>' +
    '<div class="brand"><span class="home-badge" hidden></span></div>' +
    '<nav class="tabbar"><button class="tab" data-tab="todo">할일</button><button class="tab" data-tab="more">더보기</button></nav>' +
    '</body>');
  return dom.window.document;
}

test('applyHomeBadge: 모드+미처리면 로고 점 표시, 홈이거나 0이면 숨김', () => {
  const d = makeDoc(); const b = d.querySelector('.home-badge');
  assert.strictEqual(b.hidden, true, '초기 숨김');
  U.applyHomeBadge(d, 'mode', 3); assert.strictEqual(b.hidden, false, '모드+남음 → 표시');
  U.applyHomeBadge(d, 'mode', 0); assert.strictEqual(b.hidden, true, '0 → 숨김');
  U.applyHomeBadge(d, 'home', 5); assert.strictEqual(b.hidden, true, '홈 → 숨김');
});

test('applyTodoTabDot: 미완료 있으면 점 생성(멱등), 0이면 제거', () => {
  const d = makeDoc(); const tt = d.querySelector('.tab[data-tab="todo"]');
  U.applyTodoTabDot(d, 2);
  const dot = tt.querySelector('.tabdot');
  assert.ok(dot, '점 생성');
  assert.strictEqual(dot.getAttribute('aria-label'), '오늘 할 일 있음', 'a11y 라벨');
  U.applyTodoTabDot(d, 5);
  assert.strictEqual(tt.querySelectorAll('.tabdot').length, 1, '중복 생성 안 함(멱등)');
  U.applyTodoTabDot(d, 0);
  assert.strictEqual(tt.querySelector('.tabdot'), null, '0이면 제거');
});

test('applyTodoTabDot: todo 탭이 없으면(가계부 모드) 안전하게 무시', () => {
  const dom = new JSDOM('<!DOCTYPE html><body><nav class="tabbar"><button class="tab" data-tab="calendar">달력</button></nav></body>');
  assert.doesNotThrow(() => U.applyTodoTabDot(dom.window.document, 3));
  assert.doesNotThrow(() => U.applyHomeBadge(dom.window.document, 'mode', 3));   // .brand 없어도 안전
});
