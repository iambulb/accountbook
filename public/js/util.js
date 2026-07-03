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
  function nextDue(ds, rep) {
    if (rep === 'monthly') {   // 같은 날 다음 달(말일 클램프: 1/31→2/28)
      const p = String(ds).split('-'), y = +p[0], m = (+p[1] || 1), d = (+p[2] || 1);
      let nm = m + 1, ny = y; if (nm > 12) { nm = 1; ny++; }
      const last = new Date(ny, nm, 0).getDate(), z = function (x) { return (x < 10 ? '0' : '') + x; };
      return ny + '-' + z(nm) + '-' + z(Math.min(d, last));
    }
    return addDays(ds, rep === 'weekly' ? 7 : 1);   // weekly=+7, 그 외(레거시 daily 포함)=+1
  }
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
  // 친구 피드 정렬: 공개 친구를 '가장 최근 할일 등록순'으로. todayReg=오늘(todayYmd) 등록했는지(무지개 테두리용). 할일 없는 친구는 뒤로(이름/uid순).
  function friendFeedOrder(friendTodosByUid, uids, todayYmd) {
    const map = friendTodosByUid || {};
    const rows = (uids || []).map(function (uid) {
      const list = map[uid] || [];
      var lastAt = '', todayReg = false;
      for (var i = 0; i < list.length; i++) { const c = (list[i] && list[i].createdAt) || ''; if (c > lastAt) lastAt = c; if (String(c).slice(0, 10) === todayYmd) todayReg = true; }
      return { uid: uid, lastAt: lastAt, todayReg: todayReg };
    });
    rows.sort(function (a, b) { if (a.lastAt !== b.lastAt) return a.lastAt < b.lastAt ? 1 : -1; return String(a.uid).localeCompare(String(b.uid)); });
    return rows;
  }
  // 스토리 링 상태(인스타그램식): none=할일 없음, seen=마지막 열람이 최신 등록 이후, today=오늘 등록·미열람(무지개), unseen=할일 있음·미열람.
  function storyRing(latestAt, seenAt, todayReg) {
    if (!latestAt) return 'none';
    if (seenAt && seenAt >= latestAt) return 'seen';
    return todayReg ? 'today' : 'unseen';
  }
  // 상대 시간 표기(now는 ms로 주입 → 테스트 가능). '방금/N분 전/N시간 전/N일 전'.
  function relTime(fromIso, nowMs) {
    if (!fromIso) return '';
    const t = new Date(fromIso).getTime(); if (isNaN(t)) return '';
    const min = Math.floor(Math.max(0, (nowMs - t)) / 60000);
    if (min < 1) return '방금';
    if (min < 60) return min + '분 전';
    const hr = Math.floor(min / 60); if (hr < 24) return hr + '시간 전';
    return Math.floor(hr / 24) + '일 전';
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
  // 내 미션 연속(스트릭) 보상 판정: N일 연속 마일스톤(7,14,…)마다 보상. hit=이번 streak이 마일스톤인지, toNext=다음 보상까지 남은 일.
  function customMissionMilestone(streak, N) {
    var n = Number(N) || 7, s = Number(streak) || 0, r = s % n;
    return { hit: s > 0 && r === 0, toNext: r === 0 ? n : (n - r) };
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
  // ===== 알뜰홈 여러 방(프리셋) — home 상태 정규화(순수). 레거시 flat(단일 방)과 신규 rooms[] 둘 다 받아 rooms 형태로. =====
  //  방별: {name,wallpaper,placed,active,poops}. 전역: current(선택 방), roomSlots(열린 방수), slots(방당 펫상한), changedAt.
  //  opts={baseRooms,maxRooms,baseSlots,maxSlots}(기본 1/5/3/20). 데이터 손실 방지: 방 데이터가 roomSlots보다 많으면 roomSlots를 올린다.
  function normalizeHome(home, opts) {
    opts = opts || {};
    var BASE = Number(opts.baseRooms) || 1, MAX = Number(opts.maxRooms) || 5;
    var BS = Number(opts.baseSlots) || 3, MS = Number(opts.maxSlots) || 20;
    var h = home || {};
    function clamp(n, lo, hi) { n = Math.floor(Number(n) || 0); return Math.max(lo, Math.min(hi, n)); }
    function normRoom(r, i) {
      r = r || {};
      return {
        name: (typeof r.name === 'string' && r.name) ? r.name : ('방 ' + (i + 1)),
        emoji: (typeof r.emoji === 'string') ? r.emoji : '',
        wallpaper: r.wallpaper || 'default',
        placed: (r.placed && typeof r.placed === 'object') ? r.placed : {},
        active: Array.isArray(r.active) ? r.active.slice() : [],
        poops: Number(r.poops) || 0
      };
    }
    var rooms = (Array.isArray(h.rooms) && h.rooms.length)
      ? h.rooms.map(normRoom)
      : [normRoom({ wallpaper: h.wallpaper, placed: h.placed, active: h.active, poops: h.poops }, 0)];  // 레거시 flat → 방1
    var roomSlots = clamp(h.roomSlots || rooms.length || BASE, BASE, MAX);
    while (rooms.length < roomSlots) rooms.push(normRoom({}, rooms.length));
    if (rooms.length > roomSlots) roomSlots = Math.min(MAX, rooms.length);   // 방 데이터가 더 많으면 손실 없이 slots 올림
    // 한 펫당 한 방만: 여러 방에 중복 등장하는 펫은 먼저 나온 방에만 남긴다.
    var seenPet = {};
    rooms.forEach(function (r) { r.active = r.active.filter(function (id) { if (seenPet[id]) return false; seenPet[id] = 1; return true; }); });
    return {
      rooms: rooms,
      current: clamp(h.current, 0, rooms.length - 1),
      showRoom: clamp(h.showRoom, 0, rooms.length - 1),   // 친구/랭킹에 보여줄 대표 방
      roomSlots: roomSlots,
      slots: clamp(h.slots || BS, BS, MS),
      changedAt: h.changedAt || ''
    };
  }

  // 가구 인벤토리 소진량 = 모든 방에 배치된 같은 itemId 개수 합(전역). 방별 배치라도 인벤토리(owned)는 전역이라 전 방 합산해야 복제 방지.
  function sumPlacedItem(rooms, id) {
    var n = 0; (rooms || []).forEach(function (r) { var p = (r && r.placed) || {}; for (var k in p) { if (p[k] && p[k].itemId === id) n++; } }); return n;
  }

  // ===== 게임 리텐션(순수) =====
  // 로그인(출석) 연속일 → 마일스톤 보상 {coins,gold}. 마일스톤(3·7·14·30)에서만 지급, 30 이후는 매 30일 반복.
  function loginStreakReward(day) {
    day = Math.floor(Number(day) || 0);
    var table = { 3: { coins: 5, gold: 0 }, 7: { coins: 20, gold: 2 }, 14: { coins: 50, gold: 3 }, 30: { coins: 100, gold: 5 } };
    if (table[day]) return table[day];
    if (day > 30 && day % 30 === 0) return table[30];
    return { coins: 0, gold: 0 };
  }
  // 컬렉션 도감 진행도. owned=보유 맵(catId→...), catalogIds=전체 펫 id 배열.
  function dexProgress(owned, catalogIds) {
    var ids = catalogIds || [], o = 0;
    ids.forEach(function (id) { if (owned && owned[id]) o++; });
    return { owned: o, total: ids.length, pct: ids.length ? Math.round(o / ids.length * 100) : 0 };
  }
  // 펫 애정도 레벨(임계 30/120/350/800/1800 — 최대 5레벨, 극악 난이도: 쓰다듬기 3시간당 +1이라 만렙까지 수백 일). 수치는 조정 예정. {level(0~5), next(다음 임계 or null), pct(다음까지 %)}.
  function affectionLevel(aff) {
    aff = Math.max(0, Math.floor(Number(aff) || 0));
    var TH = [30, 120, 350, 800, 1800], level = 0;
    for (var i = 0; i < TH.length; i++) { if (aff >= TH[i]) level = i + 1; }
    var prev = level > 0 ? TH[level - 1] : 0, next = level < TH.length ? TH[level] : null;
    return { level: level, next: next, pct: next != null ? Math.round((aff - prev) / (next - prev) * 100) : 100 };
  }
  // 자주 쓰는 거래 → 빠른입력 후보. txs에서 (desc|category|amount|type) 빈도 상위 N. 지출류만(빈 desc 제외).
  function frequentTxTemplates(txs, limit) {
    var map = {}, EXP = { expense: 1, prepaid_spend: 1, point_spend: 1 };
    (txs || []).forEach(function (t) {
      if (!t || !EXP[t.type]) return;
      var desc = (t.desc || '').trim(); if (!desc) return;
      var key = t.type + '|' + desc + '|' + (t.category || '') + '|' + (Number(t.amount) || 0);
      var e = map[key] || (map[key] = { type: t.type, desc: desc, category: t.category || '', amount: Number(t.amount) || 0, count: 0, last: '' });
      e.count++; if ((t.date || '') > e.last) e.last = t.date || '';
    });
    return Object.keys(map).map(function (k) { return map[k]; })
      .sort(function (a, b) { return b.count - a.count || (a.last < b.last ? 1 : -1); })
      .slice(0, limit || 6);
  }

  // 거래 검색 매칭(순수). q={keyword,dateFrom,dateTo,amountMin,amountMax,type}. keyword는 desc+memo+category 부분일치(소문자).
  function txMatches(tx, q) {
    if (!tx) return false; q = q || {};
    if (q.type && tx.type !== q.type) return false;
    if (q.keyword) {
      var k = String(q.keyword).toLowerCase();
      var hay = ((tx.desc || '') + ' ' + (tx.memo || '') + ' ' + (tx.category || '')).toLowerCase();
      if (hay.indexOf(k) < 0) return false;
    }
    var d = tx.date || '';
    if (q.dateFrom && d < q.dateFrom) return false;
    if (q.dateTo && d > q.dateTo) return false;
    var amt = Math.abs(Number(tx.amount) || 0);
    if (q.amountMin !== undefined && q.amountMin !== null && q.amountMin !== '' && amt < Number(q.amountMin)) return false;
    if (q.amountMax !== undefined && q.amountMax !== null && q.amountMax !== '' && amt > Number(q.amountMax)) return false;
    return true;
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
  // 무료 응원 선물 풀(현 경제 기반): 대부분 저가 소비템, 가끔 은화. 금화는 제외(크로스유저 통화 민팅 방지). 가중치 합 100.
  var FREE_GIFT_TABLE = [
    { type: 'consum', key: 'food',  qty: 2,  w: 35 },
    { type: 'consum', key: 'water', qty: 2,  w: 35 },
    { type: 'coins',              qty: 10, w: 30 }
  ];
  // rand∈[0,1) 로 가중 선택 → 선물 1개 {type,key?,qty}. 순수(테스트 대상). 범위 밖이면 마지막 항목.
  function rollFreeGift(rand) {
    var total = 0, i; for (i = 0; i < FREE_GIFT_TABLE.length; i++) total += FREE_GIFT_TABLE[i].w;
    var r = (Number(rand) || 0); if (r < 0) r = 0; if (r >= 1) r = 0.999999;
    var t = r * total, acc = 0;
    for (i = 0; i < FREE_GIFT_TABLE.length; i++) { acc += FREE_GIFT_TABLE[i].w; if (t < acc) return pickGift(FREE_GIFT_TABLE[i]); }
    return pickGift(FREE_GIFT_TABLE[FREE_GIFT_TABLE.length - 1]);
  }
  function pickGift(e) { var g = { type: e.type, qty: e.qty }; if (e.key) g.key = e.key; return g; }
  // 시즌: 이달의 펫 — monthKey를 해시해 후보 id 중 하나로 결정(모든 사용자 동일·매월 로테이션·순수).
  function featuredPetOfMonth(monthKey, ids) {
    ids = ids || []; if (!ids.length) return null;
    var s = String(monthKey || ''), h = 0;
    for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; }
    return ids[h % ids.length];
  }
  function applyTodoTabDot(doc, todos) {
    if (!doc) return; var tt = doc.querySelector('.tabbar .tab[data-tab="todo"]'); if (!tt) return;
    var dot = tt.querySelector('.tabdot');
    if ((todos | 0) > 0) { if (!dot) { dot = doc.createElement('span'); dot.className = 'tabdot'; dot.setAttribute('aria-label', '오늘 할 일 있음'); tt.appendChild(dot); } }
    else if (dot) { dot.remove(); }
  }

  var api = { CURRENCIES: CURRENCIES, won: won, fmtComma: fmtComma, parseAmount: parseAmount, curInfo: curInfo, fmtForeign: fmtForeign, krwFromForeign: krwFromForeign, sumByCurrency: sumByCurrency, computeSettleAmounts: computeSettleAmounts, personKey: personKey, addDays: addDays, nextDue: nextDue, dueDiffDays: dueDiffDays, todoScope: todoScope, friendTodoOrder: friendTodoOrder, friendFeedOrder: friendFeedOrder, storyRing: storyRing, relTime: relTime, missionStreak: missionStreak, weekDotsData: weekDotsData, todayMissionState: todayMissionState, customMissionMilestone: customMissionMilestone, normalizeHome: normalizeHome, sumPlacedItem: sumPlacedItem, loginStreakReward: loginStreakReward, dexProgress: dexProgress, affectionLevel: affectionLevel, frequentTxTemplates: frequentTxTemplates, txMatches: txMatches, todayPending: todayPending, homeBadgeShow: homeBadgeShow, homeCardKind: homeCardKind, applyHomeBadge: applyHomeBadge, applyTodoTabDot: applyTodoTabDot, featuredPetOfMonth: featuredPetOfMonth, FREE_GIFT_TABLE: FREE_GIFT_TABLE, rollFreeGift: rollFreeGift };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  for (var k in api) { root[k] = api[k]; }   // 브라우저 전역 노출(기존 코드가 전역으로 참조)
})(typeof window !== 'undefined' ? window : globalThis);
