// 🧹 개명 전파(이름 스윕) 순수 로직 테스트 — buildRenameSweep / unknownPersonNames (public/js/util.js)
const test = require('node:test');
const assert = require('node:assert');
const U = require('../public/js/util.js');

const MAP = { '구공': { uid: 'u1', name: '구근' } };

test('buildRenameSweep: 거래 user 치환 + userUid 백필, 다른 멤버 uid 레코드는 보호', () => {
  const r = U.buildRenameSweep({ transactions: [
    { ownerUid: 'u1', id: 't1', user: '구공' },                      // 이름만 → 치환+백필
    { ownerUid: 'u1', id: 't2', user: '구공', userUid: 'u1' },       // uid 일치 → 이름만 치환
    { ownerUid: 'u2', id: 't3', user: '구공', userUid: 'u2' },       // 다른 멤버 uid → 보호(스킵)
    { ownerUid: 'u1', id: 't4', user: '공동' },                      // 매핑 없음 → 스킵
  ] }, MAP);
  assert.equal(r.upd['transactions/u1/t1/user'], '구근');
  assert.equal(r.upd['transactions/u1/t1/userUid'], 'u1');
  assert.equal(r.upd['transactions/u1/t2/user'], '구근');
  assert.equal(r.upd['transactions/u1/t2/userUid'], undefined);
  assert.ok(!Object.keys(r.upd).some(k => k.includes('/t3/') || k.includes('/t4/')));
  assert.equal(r.count, 2);
});

test('buildRenameSweep: 정산 이름 필드 — payer·splitParticipants·splitAmounts 키 함께 치환', () => {
  const r = U.buildRenameSweep({ transactions: [
    { ownerUid: 'u1', id: 't1', user: '구근', userUid: 'u1', payer: '구공',
      splitParticipants: ['구공', '현경'], splitAmounts: { '구공': 5000, '현경': 5000 } },
  ] }, MAP);
  assert.equal(r.upd['transactions/u1/t1/payer'], '구근');
  assert.deepEqual(r.upd['transactions/u1/t1/splitParticipants'], ['구근', '현경']);
  assert.deepEqual(r.upd['transactions/u1/t1/splitAmounts'], { '구근': 5000, '현경': 5000 });
});

test('buildRenameSweep: 정기(user/owner)·계좌·예산·대출·구독 owner + 할일 assignedName + 목적별 participants + 정산기록', () => {
  const r = U.buildRenameSweep({
    recurring: [{ ownerUid: 'u1', id: 'r1', user: '구공', owner: '구공' }],
    accounts: [{ id: 'a1', owner: '구공' }],
    budgets: [{ id: 'b1', owner: '구공', ownerUid: 'u1' }],
    loans: [{ id: 'l1', owner: '구공' }],
    subscriptions: [{ id: 's1', owner: '구공' }],
    todos: [{ id: 'd1', assignedName: '구공', assignedUid: 'u1' }],
    purposeBooks: [{ id: 'p1', participants: ['구공', '현경'] }],
    settlementPayments: [{ ownerUid: 'u1', id: 'sp1', owner: '구공', fromPerson: '구공', toPerson: '현경' }],
  }, MAP);
  assert.equal(r.upd['recurring/u1/r1/user'], '구근');
  assert.equal(r.upd['recurring/u1/r1/userUid'], 'u1');
  assert.equal(r.upd['recurring/u1/r1/owner'], '구근');
  assert.equal(r.upd['accounts/a1/owner'], '구근');
  assert.equal(r.upd['accounts/a1/ownerUid'], 'u1');
  assert.equal(r.upd['budgets/b1/owner'], '구근');
  assert.equal(r.upd['budgets/b1/ownerUid'], undefined);   // 이미 있음 → 백필 안 함
  assert.equal(r.upd['loans/l1/owner'], '구근');
  assert.equal(r.upd['subscriptions/s1/owner'], '구근');
  assert.equal(r.upd['todos/d1/assignedName'], '구근');
  assert.deepEqual(r.upd['purposeBooks/p1/participants'], ['구근', '현경']);
  assert.equal(r.upd['settlementPayments/u1/sp1/owner'], '구근');
  assert.equal(r.upd['settlementPayments/u1/sp1/fromPerson'], '구근');
  assert.equal(r.upd['settlementPayments/u1/sp1/toPerson'], undefined);
});

test('buildRenameSweep: 멱등 — 이미 새 이름이면 빈 계획(uid 백필만 남은 경우는 백필)', () => {
  const clean = U.buildRenameSweep({ transactions: [{ ownerUid: 'u1', id: 't1', user: '구근', userUid: 'u1' }] }, MAP);
  assert.equal(clean.count, 0);
  assert.deepEqual(clean.upd, {});
  const backfill = U.buildRenameSweep({ transactions: [{ ownerUid: 'u1', id: 't1', user: '구근' }] },
    { '구근': { uid: 'u1', name: '구근' } });   // 이름 동일 매핑 → uid만 백필
  assert.equal(backfill.upd['transactions/u1/t1/userUid'], 'u1');
  assert.equal(backfill.upd['transactions/u1/t1/user'], undefined);
});

test('buildRenameSweep: 공동 매핑(uid 없음) — 이름만 치환·백필 없음, uid 있는 레코드는 보호', () => {
  const r = U.buildRenameSweep({ transactions: [
    { ownerUid: 'u1', id: 't1', user: '옛공동' },
    { ownerUid: 'u1', id: 't2', user: '옛공동', userUid: 'u9' },
  ] }, { '옛공동': { uid: '', name: '공동' } });
  assert.equal(r.upd['transactions/u1/t1/user'], '공동');
  assert.equal(r.upd['transactions/u1/t1/userUid'], undefined);
  assert.ok(!Object.keys(r.upd).some(k => k.includes('/t2/')));
});

test('unknownPersonNames: 멤버 이름·공동·빈값·멤버 uid 제외하고 건수 집계', () => {
  const out = U.unknownPersonNames({
    transactions: [{ user: '구공' }, { user: '구공', payer: '구공' }, { user: '구근' }, { user: '공동' }, { user: 'u1' }],
    accounts: [{ owner: '구공' }, { owner: '지인A' }],
    purposeBooks: [{ participants: ['지인A', '구근'] }],
  }, ['구근', '현경'], ['u1', 'u2']);
  assert.equal(out['구공'], 4);      // user 2건 + payer 1건 + 계좌 owner 1건
  assert.equal(out['지인A'], 2);     // 계좌 owner + 목적별 참여자
  assert.equal(out['구근'], undefined);
  assert.equal(out['공동'], undefined);
  assert.equal(out['u1'], undefined);
});
