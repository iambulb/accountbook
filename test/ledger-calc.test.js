'use strict';
// 가계부 순수 계산(정산 분담·최소 송금 매칭) 단위 테스트 — public/js/ledger-calc.js
// 실행: npm test (node --test)
const test = require('node:test');
const assert = require('node:assert');
const { settlementSplit, greedySettle, buildTx } = require('../public/js/ledger-calc.js');

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

// ===== buildTx(순수 거래 조립·검증) — views.js saveTx에서 추출 =====
// 기본 = KRW 지출(카테고리 있음, 현금 출금). 각 테스트는 override로 분기.
function tx0(o) {
  return Object.assign({
    type: 'expense', curCode: 'KRW', foreign: 10000, rate: 1, rawAmount: 10000,
    date: '2026-07-09', iso: '2026-07-09T12:00:00.000Z', desc: '', memo: '',
    effect: { debit: true }, hasCat: true, cat: '식비', typeLabel: '지출', isActualDefault: true,
    consumer: '나', consumerUid: 'u1', consumerIsMember: true,
    fxSource: 'manual', from: '현금', to: '', adjSign: '',
    hasCard: false, cardIncluded: false, cardPerfAmount: 0, cardPerfReason: '',
    pb: '', pbName: '', settle: null, oldTx: null
  }, o || {});
}

test('buildTx — 기본 지출(카테고리·출금계정·소비대상 uid)', () => {
  const r = buildTx(tx0());
  assert.ok(!r.error && r.tx);
  const tx = r.tx;
  assert.strictEqual(tx.type, 'expense');
  assert.strictEqual(tx.amount, 10000);
  assert.strictEqual(tx.user, '나');
  assert.strictEqual(tx.userUid, 'u1');           // consumerIsMember → uid 병행
  assert.strictEqual(tx.desc, '식비');            // desc 비고 hasCat → cat
  assert.strictEqual(tx.category, '식비');
  assert.strictEqual(tx.from, '현금');            // effect.debit
  assert.strictEqual(tx.isActualExpense, true);
  assert.ok(!('to' in tx));                        // credit 없음
  assert.ok(!('currency' in tx));                  // KRW
});

test('buildTx — 검증 실패(금액/환율/환산0)', () => {
  assert.deepStrictEqual(buildTx(tx0({ foreign: 0 })), { error: '금액을 입력하세요' });
  assert.deepStrictEqual(buildTx(tx0({ curCode: 'USD', rate: 0 })), { error: '환율을 입력하세요' });
  assert.deepStrictEqual(buildTx(tx0({ rawAmount: 0 })), { error: '환산 금액이 0이에요' });
});

test('buildTx — desc 직접입력 우선', () => {
  assert.strictEqual(buildTx(tx0({ desc: '점심' })).tx.desc, '점심');
});

test('buildTx — 외화 필드', () => {
  const tx = buildTx(tx0({ curCode: 'USD', foreign: 10, rate: 1400, rawAmount: 14000 })).tx;
  assert.strictEqual(tx.currency, 'USD');
  assert.strictEqual(tx.foreignAmount, 10);
  assert.strictEqual(tx.fxRate, 1400);
  assert.strictEqual(tx.fxSource, 'manual');
  assert.strictEqual(tx.fxDate, '2026-07-09');
});

test('buildTx — 이체 출금=입금 계정이면 에러', () => {
  const r = buildTx(tx0({ type: 'transfer', effect: { debit: true, credit: true }, from: 'A', to: 'A', hasCat: false }));
  assert.deepStrictEqual(r, { error: '출금/입금 계정이 같습니다' });
});

test('buildTx — 이체 서로 다른 계정(from·to 둘 다)', () => {
  const tx = buildTx(tx0({ type: 'transfer', effect: { debit: true, credit: true }, from: 'A', to: 'B', hasCat: false })).tx;
  assert.strictEqual(tx.from, 'A'); assert.strictEqual(tx.to, 'B');
});

test('buildTx — 잔액조정 음수 부호', () => {
  const tx = buildTx(tx0({ type: 'balance_adjustment', effect: {}, adjSign: '-', to: '통장', hasCat: false })).tx;
  assert.strictEqual(tx.to, '통장');
  assert.strictEqual(tx.amount, -10000);
  assert.ok(!('from' in tx));
});

test('buildTx — 수입(credit)은 to만', () => {
  const tx = buildTx(tx0({ type: 'income', effect: { credit: true }, to: '통장', cat: '급여', typeLabel: '수입' })).tx;
  assert.strictEqual(tx.to, '통장');
  assert.ok(!('from' in tx));
  assert.strictEqual(tx.category, '급여');
});

test('buildTx — 카드 실적 포함/제외/금액폴백', () => {
  const inc = buildTx(tx0({ hasCard: true, cardIncluded: true, cardPerfAmount: 5000 })).tx;
  assert.strictEqual(inc.cardPerformanceIncluded, true);
  assert.strictEqual(inc.cardPerformanceAmount, 5000);
  assert.strictEqual(inc.cardPerformanceExcludedReason, '');
  const exc = buildTx(tx0({ hasCard: true, cardIncluded: false, cardPerfReason: '해외결제' })).tx;
  assert.strictEqual(exc.cardPerformanceIncluded, false);
  assert.strictEqual(exc.cardPerformanceAmount, 0);
  assert.strictEqual(exc.cardPerformanceExcludedReason, '해외결제');
  const fb = buildTx(tx0({ hasCard: true, cardIncluded: true, cardPerfAmount: 0 })).tx;
  assert.strictEqual(fb.cardPerformanceAmount, 10000);   // 0 → rawAmount 폴백
});

test('buildTx — 카드 아님이면 실적 필드 없음', () => {
  const tx = buildTx(tx0({ hasCard: false })).tx;
  assert.ok(!('cardPerformanceIncluded' in tx));
});

test('buildTx — 목적별+정산 포함', () => {
  const tx = buildTx(tx0({ pb: 'pb1', pbName: '여행', settle: { inc: true, payer: '나', splitType: 'equal', participants: ['나', '친구'], amounts: { 나: 5000, 친구: 5000 }, memo: '숙소' } })).tx;
  assert.strictEqual(tx.purposeBookId, 'pb1');
  assert.strictEqual(tx.purposeBookName, '여행');
  assert.strictEqual(tx.settlementIncluded, true);
  assert.strictEqual(tx.payer, '나');
  assert.strictEqual(tx.splitType, 'equal');
  assert.deepStrictEqual(tx.splitParticipants, ['나', '친구']);
  assert.strictEqual(tx.settlementStatus, 'unsettled');
  assert.strictEqual(tx.settlementMemo, '숙소');
});

test('buildTx — 목적별 정산 없음(none)', () => {
  const tx = buildTx(tx0({ pb: 'pb1', pbName: '여행', settle: { inc: false } })).tx;
  assert.strictEqual(tx.settlementIncluded, false);
  assert.strictEqual(tx.payer, '나');            // tx.user 폴백
  assert.strictEqual(tx.splitType, 'none');
  assert.strictEqual(tx.settlementStatus, 'none');
});

test('buildTx — 편집 백링크 보존(빈값/null 제외)', () => {
  const tx = buildTx(tx0({ oldTx: { recurringId: 'r1', giftEventId: 'g1', loanId: '', linkedTransactionId: null, other: 'x' } })).tx;
  assert.strictEqual(tx.recurringId, 'r1');
  assert.strictEqual(tx.giftEventId, 'g1');
  assert.ok(!('loanId' in tx));                   // 빈문자 제외
  assert.ok(!('linkedTransactionId' in tx));      // null 제외
  assert.ok(!('other' in tx));                    // 화이트리스트 외 제외
});

test('buildTx — 비멤버 소비대상은 userUid 미저장', () => {
  const tx = buildTx(tx0({ consumerIsMember: false })).tx;
  assert.ok(!('userUid' in tx));
});
