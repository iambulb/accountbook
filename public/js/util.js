/* 알뜰(Eggarden) 순수 유틸 — 돈·통화·정산 계산을 한 곳에서만 정의.
   브라우저에서는 전역(window.*)으로 노출되고, Node(require)에서는 module.exports로 노출돼 단위 테스트 대상이 된다.
   ⚠️ 여기 함수들은 부수효과/전역·DOM 의존 없이 순수하게 유지할 것(테스트 가능성 보장). */
(function (root) {
  'use strict';

  // 해외통화(여행용). dec=금액 소수 자릿수. 환율은 항상 "원화 per 1단위", 거래 amount는 원화 환산액.
  var CURRENCIES = [
    { code: 'KRW', name: '대한민국 원', sym: '₩', dec: 0 },
    { code: 'USD', name: '미국 달러', sym: '$', dec: 2 },
    { code: 'JPY', name: '일본 엔', sym: '¥', dec: 0 },
    { code: 'EUR', name: '유로', sym: '€', dec: 2 },
    { code: 'CNY', name: '중국 위안', sym: '元', dec: 2 },
    { code: 'GBP', name: '영국 파운드', sym: '£', dec: 2 },
    { code: 'AUD', name: '호주 달러', sym: 'A$', dec: 2 },
    { code: 'THB', name: '태국 바트', sym: '฿', dec: 2 },
    { code: 'VND', name: '베트남 동', sym: '₫', dec: 0 },
    { code: 'TWD', name: '대만 달러', sym: 'NT$', dec: 2 },
    { code: 'HKD', name: '홍콩 달러', sym: 'HK$', dec: 2 },
    { code: 'SGD', name: '싱가포르 달러', sym: 'S$', dec: 2 }
  ];

  function won(n) { const v = Number(n || 0); return (v < 0 ? '-' : '') + '₩' + Math.abs(v).toLocaleString(); }
  function fmtComma(n) { const d = String(n == null ? '' : n).replace(/[^0-9]/g, ''); return d ? Number(d).toLocaleString() : ''; }
  function parseAmount(s) { return Number(String(s == null ? '' : s).replace(/[^0-9]/g, '')) || 0; }
  function curInfo(code) { return CURRENCIES.find(function (c) { return c.code === code; }) || { code: 'KRW', name: '원', sym: '₩', dec: 0 }; }
  function fmtForeign(amt, code) { const c = curInfo(code); const n = Number(amt || 0); return c.sym + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: c.dec }); }
  // 외화 원금 × 환율 → 원화(정수 반올림). 거래 저장 시 amount 산정에 사용.
  function krwFromForeign(foreign, rate) { return Math.round((Number(foreign) || 0) * (Number(rate) || 0)); }
  // 거래들을 통화별로 합산 → { CODE:{foreign, krw} }. amount는 항상 원화라 krw 합, foreign은 원통화 원금 합(KRW는 동일).
  function sumByCurrency(txs) {
    const out = {};
    (txs || []).forEach(function (t) {
      const c = t.currency || 'KRW';
      const o = out[c] || (out[c] = { foreign: 0, krw: 0 });
      o.krw += Number(t.amount) || 0;
      o.foreign += (c === 'KRW' ? (Number(t.amount) || 0) : (Number(t.foreignAmount) || 0));
    });
    return out;
  }
  // 정산 분담액 계산. equal=균등(나머지는 마지막 참여자), custom=직접 입력액, 그 외=균등 기준.
  function computeSettleAmounts(type, parts, amount, customMap) {
    if (type === 'custom') {
      const has = customMap && parts.some(function (n) { return customMap[n] != null; });
      if (!has) return computeSettleAmounts('equal', parts, amount);
      const out = {}; parts.forEach(function (n) { out[n] = Math.round(Number(customMap[n]) || 0); }); return out;
    }
    const out = {}, n = parts.length || 1, base = Math.floor((amount || 0) / n);
    parts.forEach(function (nm) { out[nm] = base; });
    if (parts.length) out[parts[parts.length - 1]] += (amount || 0) - base * n;
    return out;
  }

  // 리포트 개인별 집계 키: 멤버는 uid(동명이인/개명 견고), 그 외/레거시는 이름. '공동'은 그대로.
  function personKey(tx) { return (tx && tx.userUid && tx.userUid !== '공동') ? tx.userUid : ((tx && tx.user) || '미지정'); }
  // 날짜 헬퍼(할일 반복·마감 계산) — 자기완결(외부 의존 없음).
  function addDays(ds, n) { const p = String(ds).split('-'); const d = new Date(+p[0], (+p[1] || 1) - 1, (+p[2] || 1) + (Number(n) || 0)); const z = function (x) { return (x < 10 ? '0' : '') + x; }; return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
  function nextDue(ds, rep) { return addDays(ds, rep === 'weekly' ? 7 : 1); }
  function dueDiffDays(dueYmd, todayYmd) { const a = new Date(dueYmd + 'T00:00:00'), b = new Date(todayYmd + 'T00:00:00'); return Math.round((a - b) / 86400000); }
  // 할일 스코프: 누락(레거시)은 담당배정형 그룹 할일로 취급.
  function todoScope(t) { return (t && t.scope === 'personal') ? 'personal' : 'group'; }
  // 공유 친구 스트립 정렬: 나(meUid) 항상 맨 앞, 이어서 '공유 ON'인 멤버를 각자 개인 할일 최신 createdAt 내림차순(동률/없음은 이름순).
  function friendTodoOrder(todos, memberUids, shareMap, meUid, nameOf) {
    const latest = {};
    (todos || []).forEach(function (t) {
      if (!t || t.scope !== 'personal') return;
      const o = t.ownerUid || t.createdByUid; if (!o) return;
      const c = t.createdAt || '';
      if (!latest[o] || c > latest[o]) latest[o] = c;
    });
    const nm = typeof nameOf === 'function' ? nameOf : function () { return ''; };
    const friends = (memberUids || []).filter(function (u) { return u !== meUid && shareMap && shareMap[u] === true; });
    friends.sort(function (a, b) {
      const la = latest[a] || '', lb = latest[b] || '';
      if (la !== lb) return la < lb ? 1 : -1;                 // 최신 먼저
      return String(nm(a)).localeCompare(String(nm(b)));      // 폴백: 이름순
    });
    return [meUid].concat(friends);
  }

  // ===== 미션(습관) 순수 헬퍼 — 오늘 홈·미션 탭 공용. 날짜는 'YYYY-MM-DD'(KST 키) 문자열, addDays 재사용. =====
  // 체크인 로그 날짜 배열 → 연속 기록(current: 오늘 또는 어제부터 이어진 일수 / best: 전체 최장 연속).
  function missionStreak(logDates, today) {
    var set = {}; (logDates || []).forEach(function (d) { if (d) set[String(d).slice(0, 10)] = true; });
    var cur = 0, anchor = set[today] ? today : (set[addDays(today, -1)] ? addDays(today, -1) : null);
    if (anchor) { var d = anchor; while (set[d]) { cur++; d = addDays(d, -1); } }
    var days = Object.keys(set).sort(), best = 0, run = 0, prev = null;
    days.forEach(function (dd) { if (prev && addDays(prev, 1) === dd) run++; else run = 1; if (run > best) best = run; prev = dd; });
    return { current: cur, best: best };
  }
  // 최근 7일(today-6 … today) 점 스트립: [{date, filled}].
  function weekDotsData(logDates, today) {
    var set = {}; (logDates || []).forEach(function (d) { if (d) set[String(d).slice(0, 10)] = true; });
    var out = []; for (var i = 6; i >= 0; i--) { var dt = addDays(today, -i); out.push({ date: dt, filled: !!set[dt] }); }
    return out;
  }
  // 오늘 미션 완료 상태(일일+커스텀 합산). doneFlags=[bool] → {done,total,pct,allDone}.
  function todayMissionState(doneFlags) {
    var arr = (doneFlags || []).map(Boolean);
    var total = arr.length, done = arr.filter(Boolean).length;
    return { done: done, total: total, pct: total ? Math.round(done / total * 100) : 0, allDone: total > 0 && done === total };
  }
  // 오늘 남은 일 단일 계산 소스(순수). 입력: 미션 완료플래그[] + 할일[] + 오늘(YYYY-MM-DD).
  //  missions=미완료 미션 수, todos=오늘+지난 미완료 할일 수, total=합, allDone=total===0,
  //  any=오늘 애초에 할 게 있었나(완료 축하 vs '예정 없음' 구분용).
  function todayPending(missionDoneFlags, todos, today) {
    var mflags = (missionDoneFlags || []).map(Boolean);
    var missionsTotal = mflags.length;
    var missions = mflags.filter(function (f) { return !f; }).length;
    var due = (todos || []).filter(function (t) { return t && t.dueDate && t.dueDate <= today; });
    var todosPending = due.filter(function (t) { return !t.done; }).length;
    var total = missions + todosPending;
    return { missions: missions, todos: todosPending, total: total, allDone: total === 0, any: missionsTotal > 0 || due.length > 0 };
  }
  // ---- 렌더 결정(순수) — 어떤 배지/카드를 그릴지 판정만. 실제 DOM 쓰기는 core/views의 얇은 래퍼가 담당. ----
  // 상단 로고 점 배지 표시 여부: 모드 화면(홈 아님)에서 오늘 미처리(total>0)일 때만.
  function homeBadgeShow(view, total) { return view !== 'home' && (total | 0) > 0; }
  // 오늘 홈에서 그릴 카드 종류: 남은 게 있으면 'sections', 다 했으면 'done', 애초에 없던 날이면 'empty'.
  function homeCardKind(pending) { var p = pending || {}; if ((p.total | 0) > 0) return 'sections'; return p.any ? 'done' : 'empty'; }
  // ---- 배지 DOM 반영(doc 주입식) — 전역 document를 참조하지 않고 인자로 받은 doc만 조작 → util은 앰비언트 의존 없이 jsdom으로 단위 테스트 가능. core가 document를 넘겨 호출. ----
  function applyHomeBadge(doc, view, total) {
    if (!doc) return; var b = doc.querySelector('.brand .home-badge');
    if (b) b.hidden = !homeBadgeShow(view, total);
  }
  function applyTodoTabDot(doc, todos) {
    if (!doc) return; var tt = doc.querySelector('.tabbar .tab[data-tab="todo"]'); if (!tt) return;
    var dot = tt.querySelector('.tabdot');
    if ((todos | 0) > 0) { if (!dot) { dot = doc.createElement('span'); dot.className = 'tabdot'; dot.setAttribute('aria-label', '오늘 할 일 있음'); tt.appendChild(dot); } }
    else if (dot) { dot.remove(); }
  }

  var api = { CURRENCIES: CURRENCIES, won: won, fmtComma: fmtComma, parseAmount: parseAmount, curInfo: curInfo, fmtForeign: fmtForeign, krwFromForeign: krwFromForeign, sumByCurrency: sumByCurrency, computeSettleAmounts: computeSettleAmounts, personKey: personKey, addDays: addDays, nextDue: nextDue, dueDiffDays: dueDiffDays, todoScope: todoScope, friendTodoOrder: friendTodoOrder, missionStreak: missionStreak, weekDotsData: weekDotsData, todayMissionState: todayMissionState, todayPending: todayPending, homeBadgeShow: homeBadgeShow, homeCardKind: homeCardKind, applyHomeBadge: applyHomeBadge, applyTodoTabDot: applyTodoTabDot };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  for (var k in api) { root[k] = api[k]; }   // 브라우저 전역 노출(기존 코드가 전역으로 참조)
})(typeof window !== 'undefined' ? window : globalThis);
