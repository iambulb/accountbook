/* 알뜰(Eggarden) 가계부 순수 계산 — 정산 분담(settlementSplit)·최소 송금 매칭(greedySettle)·거래 조립/검증(buildTx).
   ⚠️ 순수 함수: 전역 state·RTDB·DOM 미접근(테스트 가능성 보장). core.js에서 이 파일로 추출(리팩토링 Phase 1, 테스트 커버리지 확대).
   브라우저=전역(window.*)으로 노출(core.js pbSettleSummary 등이 호출), Node(require)=module.exports로 노출(test/ledger-calc.test.js).
   로드 위치: util.js 다음·core.js 앞(= core.js가 런타임에 이 전역을 참조). */
(function (root) {
  'use strict';

  // 📊 실제 소비 판정(단일 소스, core.js에서 이전) — "소비성 유형(expense·prepaid_spend·point_spend)"만 실소비가 될 수 있다(타입 게이트).
  //  ⚠️ 수입(income)은 buildTx가 isActualExpense:true 로 저장하지만(실수입 마커 — realIncome 필터용) 지출 집계에 절대 섞이면 안 된다
  //  — 예전 isActual 이 타입을 안 보고 플래그만 봐서 '총지출 = 지출 + 월급'으로 부풀고 예산·달력 실제소비까지 오염되던 치명 버그(사용자 보고, 2026-08).
  //  ACTUAL_TYPES 는 constants.js 의 ACTUAL_DEFAULT 와 동일 집합(Node 테스트에서도 쓰도록 자체 정의 — 소비성 유형을 추가하면 두 곳을 같이 갱신).
  var ACTUAL_TYPES = { expense: 1, prepaid_spend: 1, point_spend: 1 };
  function isActual(t) { return !!(t && ACTUAL_TYPES[t.type]) && t.isActualExpense !== false; }
  function actualSpend(list) { return (list || []).filter(isActual).reduce(function (s, t) { return s + (Number(t.amount) || 0); }, 0); }

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

  // 폼에서 읽은 원시 입력(inp) → 거래 객체 { tx }(+ 함께결제 보조거래 { subTx }) 또는 검증 실패 { error }. DOM/state/RTDB 미접근(순수).
  // views.js saveTx의 조립·검증부를 그대로 추출 — DOM 읽기는 readTxForm(비순수)이, 쓰기·보상은 saveTx가 담당.
  // inp: { type,curCode,foreign,rate,rawAmount,date,iso,desc,memo,effect,hasCat,cat,typeLabel,isActualDefault,
  //        consumer,consumerUid,consumerIsMember,fxSource,from,to,adjSign,hasCard,cardIncluded,cardPerfAmount,cardPerfReason,pb,pbName,settle,oldTx,
  //        coAmount,coAcct,coTxType,   ← 💳+✨ 함께결제(포인트·선불 일부 + 나머지는 카드/계좌)
  //        xws }   ← 🔗 그룹 간 이체(연동): { wsId,wsName,acctId,acctName,dir:'out'|'in', myWsId,myWsName,myAcctName }
  //                    transfer 전용. 내 쪽 반쪽엔 link* 필드만 싣고(out=to 미설정·in=from 미설정 — 잔액 캐시가 없는 계좌 id를 안 건드리게),
  //                    상대 ws에 쓸 반쪽 xTx를 함께 반환한다. linkTxId(같은 키)는 saveTx가 채운다(coPay 관례).
  //                    ⚠️ link* 필드는 oldTx 보존 배열에 넣지 않는다 — 연동 해제 시 옛 링크가 부활하면 원격 반쪽만 지워지고 링크가 남는 모순(xws 분기가 명시 재생성).
  function buildTx(inp) {
    if (!inp.foreign) return { error: '금액을 입력하세요' };
    if (inp.curCode !== 'KRW' && !(inp.rate > 0)) return { error: '환율을 입력하세요' };
    if (!inp.rawAmount) return { error: '환산 금액이 0이에요' };
    const e = inp.effect || {}, type = inp.type;
    // 🔗 그룹 간 이체(연동) 검증 — transfer 전용, 받는(상대) ws·계좌 필수
    const xws = (inp.xws && type === 'transfer') ? inp.xws : null;
    if (xws && !xws.wsId) return { error: '받는 그룹을 선택하세요' };
    if (xws && !xws.acctId) return { error: '받는 그룹의 계좌를 선택하세요' };
    // 💳+✨ 함께결제 검증 — 총액(rawAmount) 중 coAmount 만큼을 포인트·선불로, 나머지를 원래 결제 수단으로 나눠 기록한다.
    const coAmt = Math.round(Number(inp.coAmount) || 0);
    if (coAmt > 0) {
      if (type !== 'expense') return { error: '함께결제는 지출에서만 쓸 수 있어요' };
      if (inp.curCode !== 'KRW') return { error: '함께결제는 원화 거래에서만 쓸 수 있어요' };
      if (!inp.coAcct) return { error: '함께 쓸 포인트·선불 수단을 고르세요' };
      if (inp.coAcct === inp.from) return { error: '결제 수단과 포인트·선불 수단이 같아요' };
      if (coAmt >= inp.rawAmount) return { error: '포인트·선불 사용액은 총액보다 작아야 해요' };
    }
    const mainAmount = inp.rawAmount - (coAmt > 0 ? coAmt : 0);
    const tx = {
      type: type, date: inp.iso, user: inp.consumer, amount: mainAmount,
      desc: inp.desc || (inp.hasCat ? (inp.cat || inp.typeLabel) : inp.typeLabel),
      // 수입은 기본 '실수입'(true) — ACTUAL_DEFAULT(소비 기본값 테이블)에 income이 없어 false로 저장되면
      // 리포트·달력의 수입 집계(원금회수 등 isActualExpense:false 제외 필터)에서 일반 수입까지 통째로 빠지는 버그(실사례).
      // 📊 isActualSet: 시트의 '실제 소비에 포함' 토글(소비성 유형) — 카드 대금 이체·대납 등 비소비 지출을 통계·예산에서 제외(잔액만 반영).
      isActualExpense: type === 'income' ? true : ((inp.isActualSet !== undefined && inp.isActualSet !== null) ? !!inp.isActualSet : !!inp.isActualDefault)
    };
    if (inp.consumerIsMember) tx.userUid = inp.consumerUid;
    if (inp.curCode !== 'KRW') { tx.currency = inp.curCode; tx.foreignAmount = inp.foreign; tx.fxRate = inp.rate; tx.fxSource = inp.fxSource || 'manual'; tx.fxDate = inp.date; }
    if (inp.memo) tx.memo = inp.memo;
    if (type === 'balance_adjustment') { tx.to = inp.to; if (inp.adjSign === '-') tx.amount = -inp.rawAmount; }
    else if (xws) {
      // 🔗 연동 이체 반쪽 — 내 쪽 계좌만 싣는다(out=출금 from만·in=입금 to만). 상대 계좌는 link*에만 보관해
      //    rebuildBalCache가 이 ws에 없는 계좌 id에 델타를 쌓거나(만에 하나 id 충돌 시 오염) 하는 일을 원천 차단.
      tx.linkWsId = xws.wsId; tx.linkDir = (xws.dir === 'in') ? 'in' : 'out';
      tx.linkAcctId = xws.acctId; tx.linkAcctName = xws.acctName || ''; tx.linkWsName = xws.wsName || '';
      if (tx.linkDir === 'in') tx.to = inp.to; else tx.from = inp.from;
    }
    else { if (e.debit) tx.from = inp.from; if (e.credit) tx.to = inp.to; }
    if (inp.hasCat) tx.category = inp.cat || '기타';
    if ((type === 'transfer' || type === 'prepaid_charge') && tx.from === tx.to) return { error: '출금/입금 계정이 같습니다' };
    if (inp.hasCard && (type === 'expense' || type === 'prepaid_charge')) {
      tx.cardPerformanceIncluded = inp.cardIncluded;
      tx.cardPerformanceAmount = inp.cardIncluded ? (inp.cardPerfAmount || mainAmount) : 0;   // 함께결제면 카드로 실제 결제한 금액(=총액−포인트분)이 기본
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
    // 💳+✨ 함께결제 보조 거래 — 포인트 계좌면 point_spend, 그 외 선불류면 prepaid_spend. 둘 다 실지출이라 합치면 총액이 그대로 통계에 잡힌다.
    //  정산(splitParticipants 등)은 본 거래에만 두어 이중 계산을 막는다(포인트분은 개인 부담으로 간주).
    let subTx = null;
    if (coAmt > 0) {
      tx.coPayAmount = coAmt; tx.coPayAcct = inp.coAcct;
      subTx = { type: inp.coTxType || 'point_spend', date: inp.iso, user: tx.user, amount: coAmt,
        desc: tx.desc, isActualExpense: tx.isActualExpense, from: inp.coAcct, coPayMain: true };   // 같은 결제의 일부 — 본 거래의 실소비 여부를 따라감
      if (tx.userUid) subTx.userUid = tx.userUid;
      if (tx.category) subTx.category = tx.category;
      if (tx.memo) subTx.memo = tx.memo;
      if (tx.purposeBookId) { subTx.purposeBookId = tx.purposeBookId; subTx.purposeBookName = tx.purposeBookName || '';
        subTx.settlementIncluded = false; subTx.payer = tx.user; subTx.splitType = 'none'; subTx.settlementStatus = 'none'; }
    }
    // 🔗 연동 이체 상대 반쪽 — 상대 ws에 저장될 대칭 거래(입금측이면 to만, 출금측이면 from만). linkTxId는 saveTx가 채움.
    //    목적별(purposeBookId)은 내 ws 소속 데이터라 상대 반쪽엔 싣지 않는다.
    let xTx = null;
    if (xws) {
      xTx = { type: 'transfer', date: inp.iso, user: tx.user, amount: tx.amount, desc: tx.desc, isActualExpense: tx.isActualExpense,
        linkWsId: xws.myWsId || '', linkDir: (tx.linkDir === 'out') ? 'in' : 'out',
        linkAcctId: (tx.linkDir === 'out') ? (inp.from || '') : (inp.to || ''),
        linkAcctName: xws.myAcctName || '', linkWsName: xws.myWsName || '' };
      if (tx.linkDir === 'out') xTx.to = xws.acctId; else xTx.from = xws.acctId;
      if (tx.userUid) xTx.userUid = tx.userUid;
      if (tx.memo) xTx.memo = tx.memo;
      if (inp.curCode !== 'KRW') { xTx.currency = inp.curCode; xTx.foreignAmount = inp.foreign; xTx.fxRate = inp.rate; xTx.fxSource = inp.fxSource || 'manual'; xTx.fxDate = inp.date; }
    }
    return { tx: tx, subTx: subTx, xTx: xTx };
  }

  // 💳 카드 기간 계산(순수) — core.js의 cardPeriod/cardUsagePeriod/cardMonthRef가 래핑해 쓴다.
  // 기간 규칙: type='calendar_month'(매월 1일~말일) | 'custom'(매월 S일 ~ 다음달 S-1일). ref가 속한 기간을 돌려준다.
  function periodFromRule(type, startDay, ref) {
    ref = ref || new Date();
    if (type !== 'custom') {
      return { start: new Date(ref.getFullYear(), ref.getMonth(), 1), end: new Date(ref.getFullYear(), ref.getMonth() + 1, 0) };
    }
    var S = Number(startDay) || 1;
    var start = new Date(ref.getFullYear(), ref.getMonth(), S);
    if (ref < start) start = new Date(ref.getFullYear(), ref.getMonth() - 1, S);
    return { start: start, end: new Date(start.getFullYear(), start.getMonth() + 1, S - 1) };
  }
  // 📅 m('YYYY-MM')월의 기간 기준일 — ‹ › 월 이동이 기간을 정확히 한 개씩 움직이게, today의 위상(시작일 도달 전/후)을 모든 달에 동일 적용.
  //   (구버전 버그: 현재 달=오늘·다른 달=15일 고정 기준일이라 시작일이 15일보다 늦으면 지난달로 갈 때 한 기간을 건너뛰고(한 달이 붕 뜸),
  //    시작일이 15일보다 이르고 오늘이 시작일 전이면 같은 기간이 두 달에 겹쳐 보였다. test/ledger-calc.test.js 회귀 테스트.)
  function monthPhaseRef(type, startDay, m, today) {
    var p = String(m || '').split('-'), y = +p[0] || 1970, mo = (+p[1] || 1) - 1;
    if (type !== 'custom') return new Date(y, mo, 15);
    var S = Number(startDay) || 1;
    today = today || new Date();
    var off = today.getDate() >= S ? 0 : -1;   // 오늘이 이번달 시작일 이후면 'm월 시작 기간', 이전이면 '전달 시작 기간' — 전 달에 같은 위상
    return new Date(y, mo + off, S);   // 그 기간의 시작일 자체를 기준일로 → periodFromRule이 정확히 그 기간을 돌려준다
  }

  var api = { settlementSplit: settlementSplit, greedySettle: greedySettle, buildTx: buildTx, isActual: isActual, actualSpend: actualSpend, periodFromRule: periodFromRule, monthPhaseRef: monthPhaseRef };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  for (var k in api) { root[k] = api[k]; }   // 브라우저 전역 노출(core.js가 전역으로 참조)
})(typeof window !== 'undefined' ? window : globalThis);
