'use strict';
// 가계부 순수 계산(정산 분담·최소 송금 매칭) 단위 테스트 — public/js/ledger-calc.js
// 실행: npm test (node --test)
const test = require('node:test');
const assert = require('node:assert');
const { settlementSplit, greedySettle } = require('../public/js/ledger-calc.js');

test('greedySettle — 2인(주고받기)', () => {
  assert.deepStrictEqual(greedySettle({ A: 100, B: -100 }), [{ from: 'B', to: 'A', amount: 100 }]);
});

test('greedySettle — 1명이 2명에게 받음(큰 채무부터)', () => {
  const out = greedySettle({ A: 100, B: -60, C: -40 });
  assert.deepStrictEqual(out, [{ from: 'B', to: 'A', amount: 60 }, { from: 'C', to: 'A', amount: 40 }]);
});

test('greedySettle — 1명이 2명에게 보냄(분할 송금)', () => {
  const out = greedySettle({ A: 50, B: 50, C: -100 });
  assert.strictEqual(out.length, 2);
  assert.strictEqual(out.reduce((s, x) => s + x.amount, 0), 100);
  assert.ok(out.every(x => x.from === 'C'));
});

test('greedySettle — 빈/이미정산(0)은 송금 없음', () => {
  assert.deepStrictEqual(greedySettle({}), []);
  assert.deepStrictEqual(greedySettle({ A: 0, B: 0 }), []);
});

test('greedySettle — 반올림(소수 잔액)', () => {
  const out = greedySettle({ A: 33.4, B: -33.4 });
  assert.deepStrictEqual(out, [{ from: 'B', to: 'A', amount: 33 }]);
});

test('settlementSplit — equal 균등(나머지 없음)', () => {
  const r = settlementSplit({ amount: -90, splitType: 'equal', splitParticipants: ['가', '나', '다'] });
  assert.deepStrictEqual(r.amounts, { 가: 30, 나: 30, 다: 30 });
  assert.deepStrictEqual(r.participants, ['가', '나', '다']);
});

test('settlementSplit — equal 나머지는 마지막 사람에게', () => {
  const r = settlementSplit({ amount: 100, splitType: 'equal', splitParticipants: ['가', '나', '다'] });
  assert.deepStrictEqual(r.amounts, { 가: 33, 나: 33, 다: 34 });
  assert.strictEqual(r.amounts['가'] + r.amounts['나'] + r.amounts['다'], 100);
});

test('settlementSplit — payer_only(결제자 전액 부담)', () => {
  const r = settlementSplit({ amount: -50, splitType: 'payer_only', payer: '가' });
  assert.deepStrictEqual(r, { payer: '가', participants: ['가'], amounts: { 가: 50 } });
});

test('settlementSplit — custom(지정 금액)', () => {
  const r = settlementSplit({ amount: -100, splitType: 'custom', splitAmounts: { 가: 70, 나: 30 } });
  assert.deepStrictEqual(r.amounts, { 가: 70, 나: 30 });
  assert.deepStrictEqual(r.participants.sort(), ['가', '나']);
});

test('settlementSplit — payer/user 폴백', () => {
  assert.strictEqual(settlementSplit({ amount: -10, user: '홍길동' }).payer, '홍길동');
  assert.strictEqual(settlementSplit({ amount: -10, payer: '가', user: '나' }).payer, '가');
});
