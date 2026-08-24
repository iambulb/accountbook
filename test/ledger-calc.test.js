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

// ===== 💳+✨ 함께결제(포인트·선불 일부 + 나머지 카드/계좌) =====
test('buildTx — 함께결제: 총액을 본 거래(나머지)와 보조 거래(포인트)로 분리', () => {
  const r = buildTx(tx0({ from: '신한카드', coAmount: 3000, coAcct: '네이버포인트', coTxType: 'point_spend' }));
  assert.ok(!r.error);
  assert.strictEqual(r.tx.amount, 7000);              // 총액 10000 − 포인트 3000
  assert.strictEqual(r.tx.coPayAmount, 3000);
  assert.strictEqual(r.tx.coPayAcct, '네이버포인트');
  assert.ok(r.subTx);
  assert.strictEqual(r.subTx.type, 'point_spend');
  assert.strictEqual(r.subTx.amount, 3000);
  assert.strictEqual(r.subTx.from, '네이버포인트');
  assert.strictEqual(r.subTx.isActualExpense, true);   // 둘 다 실지출 → 합치면 총액이 통계에 그대로
  assert.strictEqual(r.subTx.category, '식비');        // 카테고리·설명·소비대상 승계
  assert.strictEqual(r.subTx.desc, '식비');
  assert.strictEqual(r.subTx.userUid, 'u1');
});

test('buildTx — 함께결제: 카드 실적 기본액은 카드로 낸 금액(총액−포인트)', () => {
  const tx = buildTx(tx0({ hasCard: true, cardIncluded: true, cardPerfAmount: 0, coAmount: 4000, coAcct: 'P', coTxType: 'point_spend' })).tx;
  assert.strictEqual(tx.cardPerformanceAmount, 6000);
});

test('buildTx — 함께결제: 선불류(포인트 아님)는 prepaid_spend 로', () => {
  const r = buildTx(tx0({ coAmount: 1000, coAcct: '쿠팡캐시', coTxType: 'prepaid_spend' }));
  assert.strictEqual(r.subTx.type, 'prepaid_spend');
});

test('buildTx — 함께결제 검증(유형·통화·수단·금액)', () => {
  assert.deepStrictEqual(buildTx(tx0({ type: 'income', effect: { credit: true }, coAmount: 1000, coAcct: 'P' })), { error: '함께결제는 지출에서만 쓸 수 있어요' });
  assert.deepStrictEqual(buildTx(tx0({ curCode: 'USD', rate: 1300, coAmount: 1000, coAcct: 'P' })), { error: '함께결제는 원화 거래에서만 쓸 수 있어요' });
  assert.deepStrictEqual(buildTx(tx0({ coAmount: 1000, coAcct: '' })), { error: '함께 쓸 포인트·선불 수단을 고르세요' });
  assert.deepStrictEqual(buildTx(tx0({ coAmount: 1000, coAcct: '현금' })), { error: '결제 수단과 포인트·선불 수단이 같아요' });
  assert.deepStrictEqual(buildTx(tx0({ coAmount: 10000, coAcct: 'P' })), { error: '포인트·선불 사용액은 총액보다 작아야 해요' });
});

test('buildTx — 함께결제 없음(coAmount 0)이면 subTx=null·금액 그대로', () => {
  const r = buildTx(tx0());
  assert.strictEqual(r.subTx, null);
  assert.strictEqual(r.tx.amount, 10000);
  assert.ok(!('coPayAmount' in r.tx));
});

test('buildTx — 함께결제 + 목적별: 보조 거래는 정산 제외(이중 계산 방지)', () => {
  const r = buildTx(tx0({ pb: 'pb1', pbName: '여행', settle: { inc: true, payer: '나', splitType: 'equal', participants: ['나', '너'], amounts: null, memo: '' },
    coAmount: 2000, coAcct: 'P', coTxType: 'point_spend' }));
  assert.strictEqual(r.tx.settlementIncluded, true);
  assert.strictEqual(r.subTx.purposeBookId, 'pb1');
  assert.strictEqual(r.subTx.settlementIncluded, false);
  assert.strictEqual(r.subTx.settlementStatus, 'none');
});

// 💰 수입 실수입 기본값 — ACTUAL_DEFAULT에 income이 없어 false로 저장되면 리포트 수입 집계에서 빠지던 버그 방지(2026-07-31)
test('buildTx: 수입은 isActualExpense=true(실수입) 기본', () => {
  const r = buildTx({ type: 'income', iso: '2026-07-31T12:00:00.000Z', date: '2026-07-31', consumer: '현경',
    rawAmount: 500000, foreign: 500000, curCode: 'KRW', effect: { credit: 'to' }, to: 'acc1', hasCat: true, cat: '월급',
    typeLabel: '수입', isActualDefault: undefined });
  assert.strictEqual(r.error, undefined);
  assert.strictEqual(r.tx.isActualExpense, true);
  // 지출은 종전대로 ACTUAL_DEFAULT를 따름
  const e = buildTx({ type: 'expense', iso: '2026-07-31T12:00:00.000Z', date: '2026-07-31', consumer: '현경',
    rawAmount: 1000, foreign: 1000, curCode: 'KRW', effect: { debit: 'from' }, from: 'acc1', hasCat: true, cat: '식비',
    typeLabel: '지출', isActualDefault: true });
  assert.strictEqual(e.tx.isActualExpense, true);
});

// 📊 실소비 토글(isActualSet) — 카드 대금 등 비소비 지출을 통계에서 제외(잔액만 반영), 함께결제 보조 거래도 따라감
test('buildTx: isActualSet 토글이 기본값을 덮는다(함께결제 subTx 동조)', () => {
  const base={ type:'expense', iso:'2026-08-05T12:00:00.000Z', date:'2026-08-05', consumer:'현경',
    rawAmount:50000, foreign:50000, curCode:'KRW', effect:{debit:'from'}, from:'acc1', hasCat:true, cat:'카드 대금',
    typeLabel:'지출', isActualDefault:true };
  assert.strictEqual(buildTx(Object.assign({},base,{isActualSet:false})).tx.isActualExpense, false);   // 토글 OFF → 통계 제외
  assert.strictEqual(buildTx(Object.assign({},base,{isActualSet:true})).tx.isActualExpense, true);
  assert.strictEqual(buildTx(base).tx.isActualExpense, true);                                          // 미지정 → 기본값
  const co=buildTx(Object.assign({},base,{isActualSet:false, coAmount:10000, coAcct:'P', coTxType:'point_spend'}));
  assert.strictEqual(co.tx.isActualExpense, false);
  assert.strictEqual(co.subTx.isActualExpense, false);   // 같은 결제의 일부 — 본 거래를 따라감
});

// ── isActual / actualSpend — 소비성 유형 타입 게이트(총지출에 수입이 섞이던 버그 방지) ──
const { isActual, actualSpend } = require('../public/js/ledger-calc.js');

test('isActual — 소비성 유형(expense·prepaid_spend·point_spend)만 실소비', () => {
  assert.strictEqual(isActual({ type: 'expense' }), true);                            // 미지정 → 기본 포함
  assert.strictEqual(isActual({ type: 'prepaid_spend' }), true);
  assert.strictEqual(isActual({ type: 'point_spend', isActualExpense: true }), true);
  assert.strictEqual(isActual({ type: 'expense', isActualExpense: false }), false);   // 실소비 토글 OFF(카드 대금 등)
});

test('isActual — 수입·이체·충전은 isActualExpense:true여도 지출 아님(치명 버그 회귀 방지)', () => {
  assert.strictEqual(isActual({ type: 'income', isActualExpense: true }), false);     // buildTx가 수입에 true 저장(실수입 마커) — 지출 집계 제외
  assert.strictEqual(isActual({ type: 'transfer', isActualExpense: true }), false);
  assert.strictEqual(isActual({ type: 'prepaid_charge' }), false);
  assert.strictEqual(isActual({ type: 'refund' }), false);
  assert.strictEqual(isActual({ type: 'balance_adjustment' }), false);
});

test('actualSpend — 실소비 합계(월급 등 수입 미포함)', () => {
  const list = [
    { type: 'expense', amount: 10000 },
    { type: 'income', amount: 3000000, isActualExpense: true },   // 월급 — 총지출에 섞이면 안 됨
    { type: 'point_spend', amount: 500 },
    { type: 'expense', amount: 99999, isActualExpense: false },   // 카드 대금(실소비 제외)
    { type: 'transfer', amount: 70000 }
  ];
  assert.strictEqual(actualSpend(list), 10500);
  assert.strictEqual(actualSpend([]), 0);
  assert.strictEqual(actualSpend(null), 0);
});

// ===== 💳 카드 기간 계산 — periodFromRule · monthPhaseRef =====
const { periodFromRule, monthPhaseRef } = require('../public/js/ledger-calc.js');
const _ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

test('periodFromRule — 달력 월 / 커스텀(S일~다음달 S-1일)', () => {
  const cal = periodFromRule('calendar_month', 1, new Date(2026, 7, 24));
  assert.strictEqual(_ymd(cal.start), '2026-08-01'); assert.strictEqual(_ymd(cal.end), '2026-08-31');
  const c1 = periodFromRule('custom', 20, new Date(2026, 7, 24));   // 8/24, 시작일 20 → 8/20~9/19
  assert.strictEqual(_ymd(c1.start), '2026-08-20'); assert.strictEqual(_ymd(c1.end), '2026-09-19');
  const c2 = periodFromRule('custom', 20, new Date(2026, 7, 5));    // 8/5 → 7/20~8/19
  assert.strictEqual(_ymd(c2.start), '2026-07-20'); assert.strictEqual(_ymd(c2.end), '2026-08-19');
});

test('monthPhaseRef — 월 이동=정확히 한 기간 이동(한 달 붕 뜨던 버그 회귀 방지)', () => {
  // 실제 버그 시나리오: 시작일 20, 오늘 8/24 — 구버전은 8월(8/20~9/19)에서 지난달로 가면 6/20~7/19로 건너뛰어 7/20~8/19가 사라졌다.
  const today = new Date(2026, 7, 24);
  const per = m => periodFromRule('custom', 20, monthPhaseRef('custom', 20, m, today));
  assert.strictEqual(_ymd(per('2026-08').start), '2026-08-20');   // 현재 달 = 오늘 포함 기간
  assert.strictEqual(_ymd(per('2026-07').start), '2026-07-20');   // 한 달 뒤로 = 정확히 직전 기간(스킵 없음)
  assert.strictEqual(_ymd(per('2026-06').start), '2026-06-20');
  // 반대 케이스: 시작일 10, 오늘 8/5(시작일 전) — 구버전은 7월과 8월이 같은 기간(7/10~8/9)으로 중복됐다.
  const today2 = new Date(2026, 7, 5);
  const per2 = m => periodFromRule('custom', 10, monthPhaseRef('custom', 10, m, today2));
  assert.strictEqual(_ymd(per2('2026-08').start), '2026-07-10');   // 현재 달 = 오늘 포함(진행 중) 기간
  assert.strictEqual(_ymd(per2('2026-07').start), '2026-06-10');   // 중복 없이 직전 기간
  // 연속성: 이전 달 기간의 끝 + 1일 = 다음 달 기간의 시작
  const a = per('2026-07'), b = per('2026-08');
  const next = new Date(a.end); next.setDate(next.getDate() + 1);
  assert.strictEqual(_ymd(next), _ymd(b.start));
  // 달력 월 규칙은 15일 고정 기준(그 달 자체)
  assert.strictEqual(_ymd(monthPhaseRef('calendar_month', 1, '2026-07', today)), '2026-07-15');
});
