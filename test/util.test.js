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

test('nextDue: 매일=+1일, 매주=+7일, 매월=다음 달 같은 날(말일 클램프)', () => {
  assert.strictEqual(U.nextDue('2026-07-01', 'daily'), '2026-07-02');
  assert.strictEqual(U.nextDue('2026-07-01', 'weekly'), '2026-07-08');
  assert.strictEqual(U.nextDue('2026-07-28', 'weekly'), '2026-08-04');
  assert.strictEqual(U.nextDue('2026-07-15', 'monthly'), '2026-08-15');   // 같은 날 다음 달
  assert.strictEqual(U.nextDue('2026-01-31', 'monthly'), '2026-02-28');   // 말일 클램프
  assert.strictEqual(U.nextDue('2026-12-10', 'monthly'), '2027-01-10');   // 연 경계
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

test('storyRing: 스토리 링 상태(none/seen/today/unseen)', () => {
  assert.strictEqual(U.storyRing('', '', false), 'none');                                   // 할일 없음
  assert.strictEqual(U.storyRing('2026-07-03T09:00:00Z', '2026-07-03T09:00:00Z', true), 'seen');   // 열람 == 최신
  assert.strictEqual(U.storyRing('2026-07-03T09:00:00Z', '2026-07-03T10:00:00Z', true), 'seen');   // 열람 이후
  assert.strictEqual(U.storyRing('2026-07-03T09:00:00Z', '', true), 'today');               // 오늘·미열람
  assert.strictEqual(U.storyRing('2026-07-03T09:00:00Z', '2026-07-03T08:00:00Z', false), 'unseen'); // 새 등록·미열람
});

test('relTime: 상대 시간 표기', () => {
  const now = new Date('2026-07-03T12:00:00Z').getTime();
  assert.strictEqual(U.relTime('2026-07-03T11:59:40Z', now), '방금');
  assert.strictEqual(U.relTime('2026-07-03T11:30:00Z', now), '30분 전');
  assert.strictEqual(U.relTime('2026-07-03T09:00:00Z', now), '3시간 전');
  assert.strictEqual(U.relTime('2026-07-01T12:00:00Z', now), '2일 전');
  assert.strictEqual(U.relTime('', now), '');
});

test('customMissionMilestone: 7일 연속 마일스톤마다 보상 + 다음까지 남은 일', () => {
  assert.deepStrictEqual(U.customMissionMilestone(0, 7), { hit: false, toNext: 7 });
  assert.deepStrictEqual(U.customMissionMilestone(3, 7), { hit: false, toNext: 4 });
  assert.deepStrictEqual(U.customMissionMilestone(7, 7), { hit: true, toNext: 7 });    // 마일스톤
  assert.deepStrictEqual(U.customMissionMilestone(8, 7), { hit: false, toNext: 6 });
  assert.deepStrictEqual(U.customMissionMilestone(14, 7), { hit: true, toNext: 7 });   // 다음 마일스톤
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

test('normalizeHome: 레거시 flat(단일 방) → rooms[0]로 이관', () => {
  const h = U.normalizeHome({ active: ['cat_a'], placed: { '2_3': { itemId: 'cushion' } }, wallpaper: 'sky', poops: 2, slots: 4, changedAt: 'x' });
  assert.strictEqual(h.rooms.length, 1);
  assert.strictEqual(h.roomSlots, 1);
  assert.strictEqual(h.current, 0);
  assert.strictEqual(h.slots, 4);              // 전역 펫 슬롯 보존
  assert.strictEqual(h.changedAt, 'x');
  assert.deepStrictEqual(h.rooms[0].active, ['cat_a']);
  assert.deepStrictEqual(h.rooms[0].placed, { '2_3': { itemId: 'cushion' } });
  assert.strictEqual(h.rooms[0].wallpaper, 'sky');
  assert.strictEqual(h.rooms[0].poops, 2);
  assert.strictEqual(h.rooms[0].name, '방 1');
});

test('normalizeHome: 한 펫당 한 방(중복 등장 제거, 먼저 나온 방 우선) + showRoom', () => {
  const h = U.normalizeHome({ rooms: [{ active: ['a', 'b'] }, { active: ['b', 'c'] }], roomSlots: 2, showRoom: 1 });
  assert.deepStrictEqual(h.rooms[0].active, ['a', 'b']);
  assert.deepStrictEqual(h.rooms[1].active, ['c']);   // b는 방0에 이미 있어 제거
  assert.strictEqual(h.showRoom, 1);
});

test('normalizeHome: showRoom 기본 0·범위 클램프', () => {
  assert.strictEqual(U.normalizeHome(null).showRoom, 0);
  assert.strictEqual(U.normalizeHome({ rooms: [{}, {}], roomSlots: 2, showRoom: 9 }).showRoom, 1);
  assert.strictEqual(U.normalizeHome({ rooms: [{}], showRoom: -3 }).showRoom, 0);
});

test('normalizeHome: 빈 입력 → 기본 방 1개', () => {
  const h = U.normalizeHome(null);
  assert.strictEqual(h.rooms.length, 1);
  assert.strictEqual(h.roomSlots, 1);
  assert.strictEqual(h.slots, 3);
  assert.deepStrictEqual(h.rooms[0], { name: '방 1', emoji: '', wallpaper: 'default', placed: {}, active: [], poops: 0, floor: 'default' });
});

test('normalizeHome: 이미 rooms면 통과 + roomSlots만큼 방 보장', () => {
  const h = U.normalizeHome({ rooms: [{ name: '고양이방', wallpaper: 'sakura', active: ['a'] }], roomSlots: 3, current: 2, slots: 5 });
  assert.strictEqual(h.rooms.length, 3);        // roomSlots(3)만큼 패딩(방 2·방 3 기본)
  assert.strictEqual(h.rooms[0].name, '고양이방');
  assert.strictEqual(h.rooms[1].name, '방 2');
  assert.strictEqual(h.current, 2);             // 클램프 범위 내
  assert.strictEqual(h.roomSlots, 3);
});

test('loginStreakReward: 마일스톤(3·7·14·30)만 지급, 30 이후 매30일 반복', () => {
  assert.deepStrictEqual(U.loginStreakReward(1), { coins: 0, gold: 0 });
  assert.deepStrictEqual(U.loginStreakReward(3), { coins: 5, gold: 0 });
  assert.deepStrictEqual(U.loginStreakReward(7), { coins: 20, gold: 2 });
  assert.deepStrictEqual(U.loginStreakReward(14), { coins: 50, gold: 3 });
  assert.deepStrictEqual(U.loginStreakReward(30), { coins: 100, gold: 5 });
  assert.deepStrictEqual(U.loginStreakReward(31), { coins: 0, gold: 0 });
  assert.deepStrictEqual(U.loginStreakReward(60), { coins: 100, gold: 5 });   // 매 30일 반복
});

test('dexProgress: 보유/전체/퍼센트', () => {
  const owned = { a: {}, c: {} };
  assert.deepStrictEqual(U.dexProgress(owned, ['a', 'b', 'c', 'd']), { owned: 2, total: 4, pct: 50 });
  assert.deepStrictEqual(U.dexProgress({}, []), { owned: 0, total: 0, pct: 0 });
  assert.deepStrictEqual(U.dexProgress(null, ['a']), { owned: 0, total: 1, pct: 0 });
});

test('affectionLevel: 임계 30/120/350/800/1800 레벨·다음·진행%(최대 5, 극악)', () => {
  assert.deepStrictEqual(U.affectionLevel(0), { level: 0, next: 30, pct: 0 });
  assert.deepStrictEqual(U.affectionLevel(15), { level: 0, next: 30, pct: 50 });
  assert.deepStrictEqual(U.affectionLevel(30), { level: 1, next: 120, pct: 0 });
  assert.deepStrictEqual(U.affectionLevel(75), { level: 1, next: 120, pct: 50 });
  assert.deepStrictEqual(U.affectionLevel(350), { level: 3, next: 800, pct: 0 });
  assert.deepStrictEqual(U.affectionLevel(800), { level: 4, next: 1800, pct: 0 });
  assert.deepStrictEqual(U.affectionLevel(1800), { level: 5, next: null, pct: 100 });
  assert.deepStrictEqual(U.affectionLevel(9999), { level: 5, next: null, pct: 100 });
});

test('rollFreeGift: 가중 누적 경계에서 올바른 보상(food35/water35/coins30, 금화 없음)', () => {
  // 누적 경계: food[0,0.35) water[0.35,0.70) coins[0.70,1)
  assert.deepStrictEqual(U.rollFreeGift(0),     { type: 'consum', qty: 2, key: 'food' });
  assert.deepStrictEqual(U.rollFreeGift(0.34),  { type: 'consum', qty: 2, key: 'food' });
  assert.deepStrictEqual(U.rollFreeGift(0.35),  { type: 'consum', qty: 2, key: 'water' });
  assert.deepStrictEqual(U.rollFreeGift(0.69),  { type: 'consum', qty: 2, key: 'water' });
  assert.deepStrictEqual(U.rollFreeGift(0.70),  { type: 'coins',  qty: 10 });
  assert.deepStrictEqual(U.rollFreeGift(0.999), { type: 'coins',  qty: 10 });
  // 범위 밖/이상값 방어: 음수→0(food), 1이상→0.999999(coins)
  assert.deepStrictEqual(U.rollFreeGift(-1), { type: 'consum', qty: 2, key: 'food' });
  assert.deepStrictEqual(U.rollFreeGift(1),  { type: 'coins', qty: 10 });
  // 금화는 풀에 없음 + 가중치 합 100
  assert.ok(!U.FREE_GIFT_TABLE.some(e => e.type === 'gold'));
  assert.strictEqual(U.FREE_GIFT_TABLE.reduce((s, e) => s + e.w, 0), 100);
});

test('featuredPetOfMonth: 결정적·후보 내·매월 로테이션', () => {
  const ids = ['a', 'b', 'c', 'd', 'e'];
  // 같은 달 → 항상 같은 결과(결정적)
  assert.strictEqual(U.featuredPetOfMonth('M2026-07', ids), U.featuredPetOfMonth('M2026-07', ids));
  // 결과는 항상 후보 안
  ['M2026-01', 'M2026-07', 'M2027-12'].forEach(m => assert.ok(ids.includes(U.featuredPetOfMonth(m, ids))));
  // 빈 후보/누락 방어
  assert.strictEqual(U.featuredPetOfMonth('M2026-07', []), null);
  assert.strictEqual(U.featuredPetOfMonth('M2026-07', null), null);
  // 후보 1개면 그것
  assert.strictEqual(U.featuredPetOfMonth('M2026-07', ['solo']), 'solo');
});

test('frequentTxTemplates: 지출류 빈도 상위(빈 desc·비지출 제외)', () => {
  const txs = [
    { type: 'expense', desc: '점심', category: '식비', amount: 12000, date: '2026-07-01' },
    { type: 'expense', desc: '점심', category: '식비', amount: 12000, date: '2026-07-03' },
    { type: 'expense', desc: '커피', category: '카페', amount: 5000, date: '2026-07-02' },
    { type: 'income', desc: '월급', category: '월급', amount: 3000000, date: '2026-07-01' },  // 비지출 제외
    { type: 'expense', desc: '', category: '식비', amount: 8000, date: '2026-07-01' },        // 빈 desc 제외
  ];
  const r = U.frequentTxTemplates(txs, 6);
  assert.strictEqual(r.length, 2);
  assert.strictEqual(r[0].desc, '점심');   // count 2 → 최상위
  assert.strictEqual(r[0].count, 2);
  assert.strictEqual(r[1].desc, '커피');
});

test('txMatches: 키워드(desc+memo+category)·기간·금액·타입 필터', () => {
  const t = { type: 'expense', desc: '스타벅스 커피', memo: '회의', category: '카페', amount: 5500, date: '2026-07-03' };
  assert.strictEqual(U.txMatches(t, { keyword: '커피' }), true);
  assert.strictEqual(U.txMatches(t, { keyword: '회의' }), true);   // memo 포함
  assert.strictEqual(U.txMatches(t, { keyword: '카페' }), true);   // category 포함
  assert.strictEqual(U.txMatches(t, { keyword: '택시' }), false);
  assert.strictEqual(U.txMatches(t, { dateFrom: '2026-07-01', dateTo: '2026-07-05' }), true);
  assert.strictEqual(U.txMatches(t, { dateFrom: '2026-07-04' }), false);
  assert.strictEqual(U.txMatches(t, { amountMin: 5000, amountMax: 6000 }), true);
  assert.strictEqual(U.txMatches(t, { amountMin: 6000 }), false);
  assert.strictEqual(U.txMatches(t, { type: 'income' }), false);
  assert.strictEqual(U.txMatches(t, { type: 'expense', keyword: '커피', amountMax: 6000 }), true);   // 복합 AND
  assert.strictEqual(U.txMatches(t, {}), true);   // 빈 쿼리=통과
});

test('sumPlacedItem: 모든 방에 배치된 같은 가구 개수 합(전역 인벤토리 소진)', () => {
  const rooms = [
    { placed: { '1_1': { itemId: 'cushion' }, '2_2': { itemId: 'bowl' } } },
    { placed: { '3_3': { itemId: 'cushion' } } },
    { placed: {} },
    {},
  ];
  assert.strictEqual(U.sumPlacedItem(rooms, 'cushion'), 2);   // 방1+방2
  assert.strictEqual(U.sumPlacedItem(rooms, 'bowl'), 1);
  assert.strictEqual(U.sumPlacedItem(rooms, 'tower'), 0);
  assert.strictEqual(U.sumPlacedItem(null, 'cushion'), 0);    // 방어
});

test('normalizeHome: 상한/클램프 + 방 데이터 손실 방지', () => {
  // roomSlots 과다 → MAX(5)로, current 음수 → 0
  const a = U.normalizeHome({ rooms: [{}], roomSlots: 99, current: -5, slots: 999 });
  assert.strictEqual(a.roomSlots, 5);
  assert.strictEqual(a.rooms.length, 5);
  assert.strictEqual(a.current, 0);
  assert.strictEqual(a.slots, 20);              // 펫 슬롯 상한
  // 방 데이터가 roomSlots보다 많으면 roomSlots를 올려 손실 방지
  const b = U.normalizeHome({ rooms: [{}, {}, {}], roomSlots: 1 });
  assert.strictEqual(b.roomSlots, 3);
  assert.strictEqual(b.rooms.length, 3);
});
