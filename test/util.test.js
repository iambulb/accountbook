'use strict';
// 돈·통화·정산 순수 계산 단위 테스트. 실행: npm test  (node --test)
const test = require('node:test');
const assert = require('node:assert');
const U = require('../public/js/util.js');

test('parseAmount: 콤마·비숫자 제거, 정수 반환', () => {
  assert.strictEqual(U.parseAmount('1,234'), 1234);
  assert.strictEqual(U.parseAmount('1,000,000'), 1000000);
  assert.strictEqual(U.parseAmount(''), 0);
  assert.strictEqual(U.parseAmount('abc'), 0);
  assert.strictEqual(U.parseAmount(null), 0);
  assert.strictEqual(U.parseAmount('₩12,300원'), 12300);
});

test('fmtComma: 숫자에 천단위 콤마', () => {
  assert.strictEqual(U.fmtComma('1234567'), '1,234,567');
  assert.strictEqual(U.fmtComma('0'), '0');
  assert.strictEqual(U.fmtComma(''), '');
  assert.strictEqual(U.fmtComma('12ab34'), '1,234');
});

test('won: 원화 표기(음수 앞부호)', () => {
  assert.strictEqual(U.won(1000), '₩1,000');
  assert.strictEqual(U.won(0), '₩0');
  assert.strictEqual(U.won(-500), '-₩500');
  assert.strictEqual(U.won(null), '₩0');
});

test('curInfo: 알 수 없는 코드는 KRW로 폴백', () => {
  assert.strictEqual(U.curInfo('USD').dec, 2);
  assert.strictEqual(U.curInfo('JPY').dec, 0);
  assert.strictEqual(U.curInfo('XXX').code, 'KRW');
  assert.strictEqual(U.curInfo('KRW').sym, '₩');
});

test('fmtForeign: 통화 기호 + 통화별 소수자리', () => {
  assert.strictEqual(U.fmtForeign(100, 'USD'), '$100');
  assert.strictEqual(U.fmtForeign(1234.5, 'USD'), '$1,234.5');
  assert.strictEqual(U.fmtForeign(50000, 'JPY'), '¥50,000');   // dec 0
  assert.strictEqual(U.fmtForeign(100, 'KRW'), '₩100');
});

test('krwFromForeign: 외화×환율 → 원화 정수 반올림', () => {
  assert.strictEqual(U.krwFromForeign(100, 1350), 135000);
  assert.strictEqual(U.krwFromForeign(12.5, 9.2), 115);       // 115.0
  assert.strictEqual(U.krwFromForeign(3, 1558.09), 4674);     // 4674.27 → 4674
  assert.strictEqual(U.krwFromForeign(100, 0), 0);
  assert.strictEqual(U.krwFromForeign(0, 1350), 0);
});

test('sumByCurrency: 통화별 원금·원화 합산', () => {
  const by = U.sumByCurrency([
    { amount: 135000, currency: 'USD', foreignAmount: 100 },
    { amount: 5000 },                                          // KRW(통화 없음)
    { amount: 200000, currency: 'JPY', foreignAmount: 20000 },
    { amount: 65000, currency: 'USD', foreignAmount: 50 }
  ]);
  assert.deepStrictEqual(by.USD, { foreign: 150, krw: 200000 });
  assert.deepStrictEqual(by.KRW, { foreign: 5000, krw: 5000 });
  assert.deepStrictEqual(by.JPY, { foreign: 20000, krw: 200000 });
  assert.deepStrictEqual(U.sumByCurrency([]), {});
});

test('computeSettleAmounts: 균등 분할(나머지는 마지막 참여자)', () => {
  assert.deepStrictEqual(U.computeSettleAmounts('equal', ['a', 'b', 'c'], 1000), { a: 333, b: 333, c: 334 });
  assert.deepStrictEqual(U.computeSettleAmounts('equal', ['a', 'b'], 1000), { a: 500, b: 500 });
  assert.deepStrictEqual(U.computeSettleAmounts('equal', ['a'], 777), { a: 777 });
});

test('computeSettleAmounts: custom 값 우선, 값 없으면 균등 폴백', () => {
  assert.deepStrictEqual(U.computeSettleAmounts('custom', ['a', 'b'], 1000, { a: 700, b: 300 }), { a: 700, b: 300 });
  // custom 지정값 없음 → equal 폴백
  assert.deepStrictEqual(U.computeSettleAmounts('custom', ['a', 'b'], 1000, {}), { a: 500, b: 500 });
});

test('personKey: 멤버는 uid, 레거시/공동은 이름', () => {
  assert.strictEqual(U.personKey({ userUid: 'uid_123', user: '철수' }), 'uid_123');   // uid 우선
  assert.strictEqual(U.personKey({ user: '철수' }), '철수');                            // 레거시(uid 없음)
  assert.strictEqual(U.personKey({ user: '공동' }), '공동');                            // 공동
  assert.strictEqual(U.personKey({ userUid: '공동', user: '공동' }), '공동');           // 공동은 uid로 안 침
  assert.strictEqual(U.personKey({}), '미지정');
});
