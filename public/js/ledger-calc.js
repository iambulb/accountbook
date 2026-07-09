/* 알뜰(Eggarden) 가계부 순수 계산 — 정산 분담(settlementSplit)·최소 송금 매칭(greedySettle)·거래 조립/검증(buildTx).
   ⚠️ 순수 함수: 전역 state·RTDB·DOM 미접근(테스트 가능성 보장). core.js에서 이 파일로 추출(리팩토링 Phase 1, 테스트 커버리지 확대).
   브라우저=전역(window.*)으로 노출(core.js pbSettleSummary 등이 호출), Node(require)=module.exports로 노출(test/ledger-calc.test.js).
   로드 위치: util.js 다음·core.js 앞(= core.js가 런타임에 이 전역을 참조). */
(function (root) {
  'use strict';

  // 거래 1건의 분담 결과: { payer, participants:[이름], amounts:{이름:금액} }. 합계 = |amount| 보정.
  function settlementSplit(t) {
    const amount = Math.abs(Number(t.amount) || 0);
    const payer = t.payer || t.user || '';
    let parts = Array.isArray(t.splitParticipants) && t.splitParticipants.length ? t.splitParticipants.slice() : [];
    const type = t.splitType || 'none';
    if (type === 'payer_only') {
      const amounts = {}; if (payer) amounts[payer] = amount; if (!parts.length && payer) parts = [payer];
      return { payer, participants: parts.length ? parts : (payer ? [payer] : []), amounts };
    }
    if (type === 'custom' && t.splitAmounts && typeof t.splitAmounts === 'object') {
      const amounts = {}; let names = parts.length ? parts : Object.keys(t.splitAmounts);
      names.forEach(n => { amounts[n] = Math.round(Number(t.splitAmounts[n]) || 0); });
      return { payer, participants: names, amounts };
    }
    // equal(기본): 균등 분배 후 나머지를 마지막 사람에게 더해 합계 보정
    if (!parts.length) parts = payer ? [payer] : [];
    const n = parts.length || 1, base = Math.floor(amount / n), amounts = {};
    parts.forEach((nm, i) => { amounts[nm] = base; });
    if (parts.length) { amounts[parts[parts.length - 1]] += amount - base * n; }
    return { payer, participants: parts, amounts };
  }

  // balance>0 = 받을 사람, balance<0 = 보낼 사람. 단순 최소 송금 매칭(0 될 때까지 순차).
  function greedySettle(balanceMap) {
    const cred = [], debt = [];
    Object.keys(balanceMap).forEach(n => { const v = Math.round(balanceMap[n]); if (v > 0) cred.push({ n, v }); else if (v < 0) debt.push({ n, v: -v }); });
    cred.sort((a, b) => b.v - a.v); debt.sort((a, b) => b.v - a.v);
    const out = []; let i = 0, j = 0;
    while (i < debt.length && j < cred.length) {
      const pay = Math.min(debt[i].v, cred[j].v);
      if (pay > 0) out.push({ from: debt[i].n, to: cred[j].n, amount: pay });
      debt[i].v -= pay; cred[j].v -= pay;
      if (debt[i].v <= 0) i++; if (cred[j].v <= 0) j++;
    }
    return out;
  }

  // 폼에서 읽은 원시 입력(inp) → 거래 객체 { tx } 또는 검증 실패 { error }. DOM/state/RTDB 미접근(순수).
  // views.js saveTx의 조립·검증부를 그대로 추출 — DOM 읽기는 readTxForm(비순수)이, 쓰기·보상은 saveTx가 담당.
  // inp: { type,curCode,foreign,rate,rawAmount,date,iso,desc,memo,effect,hasCat,cat,typeLabel,isActualDefault,
  //        consumer,consumerUid,consumerIsMember,fxSource,from,to,adjSign,hasCard,cardIncluded,cardPerfAmount,cardPerfReason,pb,pbName,settle,oldTx }
  function buildTx(inp) {
    if (!inp.foreign) return { error: '금액을 입력하세요' };
    if (inp.curCode !== 'KRW' && !(inp.rate > 0)) return { error: '환율을 입력하세요' };
    if (!inp.rawAmount) return { error: '환산 금액이 0이에요' };
    const e = inp.effect || {}, type = inp.type;
    const tx = {
      type: type, date: inp.iso, user: inp.consumer, amount: inp.rawAmount,
      desc: inp.desc || (inp.hasCat ? (inp.cat || inp.typeLabel) : inp.typeLabel),
      isActualExpense: !!inp.isActualDefault
    };
    if (inp.consumerIsMember) tx.userUid = inp.consumerUid;
    if (inp.curCode !== 'KRW') { tx.currency = inp.curCode; tx.foreignAmount = inp.foreign; tx.fxRate = inp.rate; tx.fxSource = inp.fxSource || 'manual'; tx.fxDate = inp.date; }
    if (inp.memo) tx.memo = inp.memo;
    if (type === 'balance_adjustment') { tx.to = inp.to; if (inp.adjSign === '-') tx.amount = -inp.rawAmount; }
    else { if (e.debit) tx.from = inp.from; if (e.credit) tx.to = inp.to; }
    if (inp.hasCat) tx.category = inp.cat || '기타';
    if ((type === 'transfer' || type === 'prepaid_charge') && tx.from === tx.to) return { error: '출금/입금 계정이 같습니다' };
    if (inp.hasCard && (type === 'expense' || type === 'prepaid_charge')) {
      tx.cardPerformanceIncluded = inp.cardIncluded;
      tx.cardPerformanceAmount = inp.cardIncluded ? (inp.cardPerfAmount || inp.rawAmount) : 0;
      tx.cardPerformanceExcludedReason = inp.cardIncluded ? '' : (inp.cardPerfReason || '');
    }
    if (inp.pb) {
      tx.purposeBookId = inp.pb;
      tx.purposeBookName = inp.pbName || '';
      const stl = inp.settle || { inc: false };
      if (stl.inc) {
        tx.settlementIncluded = true; tx.payer = stl.payer || tx.user; tx.splitType = stl.splitType;
        tx.splitParticipants = stl.participants; tx.splitAmounts = stl.amounts; tx.settlementStatus = 'unsettled';
        if (stl.memo) tx.settlementMemo = stl.memo;
      } else {
        tx.settlementIncluded = false; tx.payer = tx.user; tx.splitType = 'none'; tx.settlementStatus = 'none';
      }
    }
    if (inp.oldTx) {
      const old = inp.oldTx;
      if (old.recurringId) tx.recurringId = old.recurringId;
      ['giftEventId', 'loanId', 'linkedTransactionId'].forEach(k => { if (old[k] != null && old[k] !== '') tx[k] = old[k]; });
    }
    return { tx: tx };
  }

  var api = { settlementSplit: settlementSplit, greedySettle: greedySettle, buildTx: buildTx };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  for (var k in api) { root[k] = api[k]; }   // 브라우저 전역 노출(core.js가 전역으로 참조)
})(typeof window !== 'undefined' ? window : globalThis);
