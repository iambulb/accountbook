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

test('addDays: 월/연 경계 넘김', () => {
  assert.strictEqual(U.addDays('2026-07-01', 1), '2026-07-02');
  assert.strictEqual(U.addDays('2026-07-31', 1), '2026-08-01');   // 월 경계
  assert.strictEqual(U.addDays('2026-12-31', 1), '2027-01-01');   // 연 경계
  assert.strictEqual(U.addDays('2026-03-01', -1), '2026-02-28');
});

test('nextDue: 매일=+1일, 매주=+7일', () => {
  assert.strictEqual(U.nextDue('2026-07-01', 'daily'), '2026-07-02');
  assert.strictEqual(U.nextDue('2026-07-01', 'weekly'), '2026-07-08');
  assert.strictEqual(U.nextDue('2026-07-28', 'weekly'), '2026-08-04');
});

test('dueDiffDays: 마감 D-day 계산', () => {
  assert.strictEqual(U.dueDiffDays('2026-07-05', '2026-07-01'), 4);   // D-4
  assert.strictEqual(U.dueDiffDays('2026-07-01', '2026-07-01'), 0);   // 오늘
  assert.strictEqual(U.dueDiffDays('2026-06-29', '2026-07-01'), -2);  // 2일 지남
});

test('todoScope: personal만 개인, 나머지(누락 포함)는 group', () => {
  assert.strictEqual(U.todoScope({ scope: 'personal' }), 'personal');
  assert.strictEqual(U.todoScope({ scope: 'group' }), 'group');
  assert.strictEqual(U.todoScope({}), 'group');            // 레거시(스코프 없음)
  assert.strictEqual(U.todoScope(null), 'group');
  assert.strictEqual(U.todoScope({ scope: 'weird' }), 'group');
});

test('friendTodoOrder: 나 먼저, 공유 ON 친구를 최근 등록순', () => {
  const todos = [
    { scope: 'personal', ownerUid: 'me', createdAt: '2026-07-01T00:00:00Z' },
    { scope: 'personal', ownerUid: 'a', createdAt: '2026-06-01T00:00:00Z' },
    { scope: 'personal', ownerUid: 'b', createdAt: '2026-07-10T00:00:00Z' },   // b가 더 최근
    { scope: 'group', ownerUid: 'a', createdAt: '2026-12-31T00:00:00Z' }        // group은 무시
  ];
  const members = ['me', 'a', 'b', 'c'];
  const share = { a: true, b: true, c: false };   // c는 공유 안 함 → 제외
  const names = { me: '나', a: '에이', b: '비', c: '씨' };
  const nameOf = u => names[u] || '';
  assert.deepStrictEqual(U.friendTodoOrder(todos, members, share, 'me', nameOf), ['me', 'b', 'a']);
});

test('friendTodoOrder: 공유자 없으면 나만, 동률은 이름순', () => {
  assert.deepStrictEqual(U.friendTodoOrder([], ['me', 'x'], { x: false }, 'me'), ['me']);
  // 둘 다 개인 할일 없음(동률) → 이름순 폴백
  const share = { b: true, a: true };
  const nameOf = u => ({ a: '가', b: '나' }[u] || '');
  assert.deepStrictEqual(U.friendTodoOrder([], ['me', 'b', 'a'], share, 'me', nameOf), ['me', 'a', 'b']);
});

test('friendFeedOrder: 최근 등록순 정렬 + 오늘 등록 판정 + 할일 없는 친구는 뒤로', () => {
  const byUid = {
    a: [{ createdAt: '2026-07-01T09:00:00Z' }],
    b: [{ createdAt: '2026-07-03T08:00:00Z' }, { createdAt: '2026-06-30T00:00:00Z' }],   // 오늘
    c: []                                                                                   // 할일 없음 → 뒤로
  };
  const rows = U.friendFeedOrder(byUid, ['a', 'b', 'c'], '2026-07-03');
  assert.deepStrictEqual(rows.map(r => r.uid), ['b', 'a', 'c']);          // 최신 b, 그다음 a, 빈 c 마지막
  assert.strictEqual(rows[0].todayReg, true);                            // b는 오늘 등록
  assert.strictEqual(rows[1].todayReg, false);                           // a는 오늘 아님
  assert.strictEqual(rows[2].lastAt, '');                                // c는 없음
});

test('personKey: 멤버는 uid, 레거시/공동은 이름', () => {
  assert.strictEqual(U.personKey({ userUid: 'uid_123', user: '철수' }), 'uid_123');   // uid 우선
  assert.strictEqual(U.personKey({ user: '철수' }), '철수');                            // 레거시(uid 없음)
  assert.strictEqual(U.personKey({ user: '공동' }), '공동');                            // 공동
  assert.strictEqual(U.personKey({ userUid: '공동', user: '공동' }), '공동');           // 공동은 uid로 안 침
  assert.strictEqual(U.personKey({}), '미지정');
});

test('missionStreak: 오늘까지 연속·최장 연속', () => {
  assert.deepStrictEqual(U.missionStreak(['2026-07-01','2026-07-02','2026-07-03'], '2026-07-03'), { current: 3, best: 3 });
  // 오늘 미체크지만 어제까지 이어짐 → current는 어제 기준 유지
  assert.deepStrictEqual(U.missionStreak(['2026-07-01','2026-07-02'], '2026-07-03'), { current: 2, best: 2 });
  // 결번(7/2 빠짐) → current는 오늘(7/3)만, best는 최장 1
  assert.deepStrictEqual(U.missionStreak(['2026-07-01','2026-07-03'], '2026-07-03'), { current: 1, best: 1 });
  // 이틀 전까지만 → 오늘도 어제도 없음 → current 0
  assert.deepStrictEqual(U.missionStreak(['2026-06-30','2026-07-01'], '2026-07-03'), { current: 0, best: 2 });
  assert.deepStrictEqual(U.missionStreak([], '2026-07-03'), { current: 0, best: 0 });
});

test('weekDotsData: 최근 7일 채움/빈', () => {
  const d = U.weekDotsData(['2026-07-03','2026-06-30'], '2026-07-03');
  assert.strictEqual(d.length, 7);
  assert.strictEqual(d[6].date, '2026-07-03'); assert.strictEqual(d[6].filled, true);   // 오늘
  assert.strictEqual(d[0].date, '2026-06-27'); assert.strictEqual(d[0].filled, false);  // 6일 전
  assert.strictEqual(d[3].date, '2026-06-30'); assert.strictEqual(d[3].filled, true);
});

test('todayMissionState: N/M·완료율·전체완료', () => {
  assert.deepStrictEqual(U.todayMissionState([true, false, true]), { done: 2, total: 3, pct: 67, allDone: false });
  assert.deepStrictEqual(U.todayMissionState([true, true]), { done: 2, total: 2, pct: 100, allDone: true });
  assert.deepStrictEqual(U.todayMissionState([]), { done: 0, total: 0, pct: 0, allDone: false });
});

test('todayPending: 미션·할일 남은 수/완료/예정없음', () => {
  const T = '2025-06-15';
  // 미션 1 남음 + 오늘/지난 할일 2 남음(미래 1은 제외)
  assert.deepStrictEqual(
    U.todayPending([true, false], [{ dueDate: '2025-06-15', done: false }, { dueDate: '2025-06-10', done: false }, { dueDate: '2025-12-01', done: false }], T),
    { missions: 1, todos: 2, total: 3, allDone: false, any: true });
  // 둘 다 완료 → allDone, 미션이 있었으니 any:true(완료 축하)
  assert.deepStrictEqual(
    U.todayPending([true, true], [{ dueDate: '2025-06-10', done: true }], T),
    { missions: 0, todos: 0, total: 0, allDone: true, any: true });
  // 애초에 아무것도 없던 날 → allDone true지만 any:false(예정 없음 톤)
  assert.deepStrictEqual(
    U.todayPending([], [], T),
    { missions: 0, todos: 0, total: 0, allDone: true, any: false });
  // 미션 0·할일만 남음 → 완료 아님
  assert.strictEqual(U.todayPending([true], [{ dueDate: '2025-06-15', done: false }], T).allDone, false);
  // 미래 할일만 있으면 today 기준 미처리 아님(예정 없음 취급)
  assert.deepStrictEqual(
    U.todayPending([], [{ dueDate: '2025-12-31', done: false }], T),
    { missions: 0, todos: 0, total: 0, allDone: true, any: false });
});

test('homeBadgeShow: 모드 화면 + 미처리 있을 때만 로고 점', () => {
  assert.strictEqual(U.homeBadgeShow('home', 5), false);   // 홈에선 항상 숨김
  assert.strictEqual(U.homeBadgeShow('mode', 0), false);   // 미처리 0이면 숨김
  assert.strictEqual(U.homeBadgeShow('mode', 3), true);    // 모드 화면 + 남음 → 표시
  assert.strictEqual(U.homeBadgeShow('home', 0), false);
});

test('homeCardKind: 남으면 sections / 다 했으면 done / 애초에 없으면 empty', () => {
  assert.strictEqual(U.homeCardKind({ total: 2, allDone: false, any: true }), 'sections');
  assert.strictEqual(U.homeCardKind({ total: 0, allDone: true, any: true }), 'done');
  assert.strictEqual(U.homeCardKind({ total: 0, allDone: true, any: false }), 'empty');
  assert.strictEqual(U.homeCardKind({}), 'empty');   // 방어(빈 입력)
  // todayPending 결과를 그대로 흘려도 일관
  assert.strictEqual(U.homeCardKind(U.todayPending([true, true], [], '2025-06-15')), 'done');
  assert.strictEqual(U.homeCardKind(U.todayPending([], [], '2025-06-15')), 'empty');
  assert.strictEqual(U.homeCardKind(U.todayPending([false], [], '2025-06-15')), 'sections');
});
