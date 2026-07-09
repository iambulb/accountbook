/* 알뜰(Eggarden) 순수 유틸 — 돈·통화·정산 계산을 한 곳에서만 정의.
   브라우저에서는 전역(window.*)으로 노출되고, Node(require)에서는 module.exports로 노출돼 단위 테스트 대상이 된다.
   ⚠️ 여기 함수들은 부수효과/전역·DOM 의존 없이 순수하게 유지할 것(테스트 가능성 보장). */
(function (root) {
  'use strict';

  // 📐 캠(방·dock) 원근 "한 묶음" 단일 소스 — dock·알뜰홈·친구방이 공유(CLAUDE.md 캠 원근 규칙).
  //   FLOOR/WALL/STAGE = CSS %(styles.css의 --cam-* 변수와 값이 같아야 함 — util.test.js가 정합을 잠금),
  //   RISE = 펫 발 올림 비율(riseMax=roomH*RISE), FURN_BASE/SPAN = 가구 bottom%=BASE+depth*SPAN,
  //   ROWS/DIV = 격자 깊이 8행·depth 분모 7(=ROWS-1). ⚠️ 하나를 바꾸면 전부 함께(뒤에서 수렴) — 과거 dock 66%·0.61 회귀의 재발 방지.
  //   (깊이 12→8행: 짧은 바닥 밴드에서 12행은 행당 ~11px로 뒤쪽이 안 구분돼 8행=~19px로 완화. 가로는 여전히 12칸=GRID_COLS.)
  var CAM = { FLOOR: 54, WALL: 46, STAGE: 58, RISE: 0.53, FURN_BASE: 3, FURN_SPAN: 46, ROWS: 8, DIV: 7 };
  function camDepth(frontRow) { return Math.max(0, Math.min(1, (CAM.ROWS - frontRow) / CAM.DIV)); }   // 격자 앞행 → depth(0=맨앞, 1=맨뒤). 레거시 frontRow>ROWS(2칸 가구·구데이터)도 [0,1]로 안전 클램프
  function camFurnBottom(depth) { return CAM.FURN_BASE + depth * CAM.FURN_SPAN; }      // 가구 bottom%
  function camZ(depth) { return Math.max(1, Math.round(CAM.ROWS - depth * CAM.DIV)); } // 가림 z(가구 frontRow와 같은 척도)

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

  function won(n) { const v = Number(n); return (Number.isFinite(v) && v < 0 ? '-' : '') + '₩' + (Number.isFinite(v) ? Math.abs(v) : 0).toLocaleString(); }   // NaN 방어(₩NaN 방지)
  function fmtComma(n) { const d = String(n == null ? '' : n).replace(/[^0-9]/g, ''); return d ? Number(d).toLocaleString() : ''; }
  // 부호 있는 입력칸 표시용(초기잔액 등 음수 허용). 선두 '-' 유지 + 천단위 콤마.
  function fmtCommaSigned(n) { const raw = String(n == null ? '' : n); const neg = raw.trim().charAt(0) === '-'; const d = raw.replace(/[^0-9]/g, ''); return (neg ? '-' : '') + (d ? Number(d).toLocaleString() : ''); }
  // 숫자 파싱: 콤마·통화기호 제거 후 소수점까지 반영해 정수 반올림. (예전 '.' 까지 제거해 붙여넣기 '1000.00'→100000 되던 100배 버그 방지.) 부호는 무시 — 음수 허용은 parseAmountSigned.
  function parseAmount(s) { const n = parseFloat(String(s == null ? '' : s).replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? Math.round(n) : 0; }
  // 부호 있는 금액(부채 계좌 초기잔액 등): 음수 허용.
  function parseAmountSigned(s) { const raw = String(s == null ? '' : s); const n = parseAmount(raw); return (raw.replace(/[^0-9-]/g, '').charAt(0) === '-') ? -n : n; }
  // 🕘 KST(한국시간) 기준 오늘 YYYY-MM-DD. 할일 마감/오늘 판정을 은화 일일상한(kstDayKey)과 같은 날 경계로 맞춰 기기 타임존 차이로 어긋나지 않게 한다.
  function todayKst() { return new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10); }
  // 📅 날짜(YYYY-MM-DD) → "정오 고정" ISO. 저장 시각을 로컬 정오로 박아 UTC 변환에도 날짜(일)가 안 밀리게 한다(정기거래 buildRecurringTx와 동일 규칙). KST 오전(00~08시) 저장분이 전날로 밀리던 버그 방지.
  function isoAtNoon(date) { const d = String(date || '').slice(0, 10); const dt = new Date(d + 'T12:00:00'); return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString(); }
  // 🔤 inline onclick 등 "HTML 속성 안, 작은따옴표 JS 문자열"에 사용자 문자열을 넣을 때 쓰는 이스케이프: 먼저 JS 문자열(\, ')용, 이어 HTML 속성(&, ", <, >)용. 아포스트로피 든 이름(예: O'Brien)이 핸들러를 깨뜨리던 문제 방지.
  function jsAttr(s) { return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
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
    if (rep === 'monthly') {   // 같은 날 다음 달. '말일'이면 다음 달도 말일로(1/31→2/28→3/31) — 28일 고정 드리프트 방지.
      const p = String(ds).split('-'), y = +p[0], m = (+p[1] || 1), d = (+p[2] || 1);
      const curLast = new Date(y, m, 0).getDate();   // 이번 달 말일
      let nm = m + 1, ny = y; if (nm > 12) { nm = 1; ny++; }
      const last = new Date(ny, nm, 0).getDate(), z = function (x) { return (x < 10 ? '0' : '') + x; };
      const day = (d >= curLast) ? last : Math.min(d, last);   // 원래가 말일이었으면 다음 달 말일로 복원
      return ny + '-' + z(nm) + '-' + z(day);
    }
    return addDays(ds, rep === 'weekly' ? 7 : 1);   // weekly=+7, 그 외(레거시 daily 포함)=+1
  }
  function dueDiffDays(dueYmd, todayYmd) { const a = new Date(dueYmd + 'T00:00:00'), b = new Date(todayYmd + 'T00:00:00'); return Math.round((a - b) / 86400000); }
  // Y-M-D의 day를 해당 월 말일로 클램프(31일 항목이 짧은 달에서 안 넘치게). anchorDay를 유지하며 굴리면 31→28→31 복원.
  function clampYmd(y, m, day) { var last = new Date(y, m, 0).getDate(), dd = Math.min(day, last), z = function (x) { return (x < 10 ? '0' : '') + x; }; return y + '-' + z(m) + '-' + z(dd); }
  // 구독 '다음 결제일'을 오늘 이후로 굴린다(저장값이 과거면 billingCycle×interval만큼 전진 — 표시·알림용, RTDB 저장 안 함·순수).
  //  구독의 nextBillingDate는 저장 폼에서만 설정돼 첫 주기 뒤 과거로 고정 → 결제 D-day·이번달예정·7일내 알림이 조용히 정지하던 버그 해소. cycle: monthly/yearly/weekly.
  function effNextBilling(nextDate, cycle, interval, today) {
    var d = String(nextDate || '').slice(0, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    today = String(today || todayKst()).slice(0, 10);
    interval = Math.max(1, Math.floor(Number(interval) || 1));
    var anchorDay = +d.slice(8, 10), guard = 0;
    while (d < today && guard++ < 600) {
      if (cycle === 'weekly') { d = addDays(d, 7 * interval); }
      else { var p = d.split('-'), y = +p[0], m = +p[1];
        if (cycle === 'yearly') { d = clampYmd(y + interval, m, anchorDay); }
        else { var nm = m + interval, ny = y + Math.floor((nm - 1) / 12); nm = ((nm - 1) % 12) + 1; d = clampYmd(ny, nm, anchorDay); } }
    }
    return d;
  }
  // 할일 스코프: 누락(레거시)은 담당배정형 그룹 할일로 취급.
  function todoScope(t) { return (t && t.scope === 'personal') ? 'personal' : 'group'; }
  // 지난(마감이 오늘 이전) 미완료 할일의 id 목록 — '지난 미완료 → 오늘로' 일괄 이동 대상.
  function overdueTodoIds(todos, today) { return (todos || []).filter(function (t) { return t && !t.done && t.dueDate && t.dueDate < today; }).map(function (t) { return t.id; }); }
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
    // 오늘 = 마감이 오늘 이하이거나 '마감 없는(언제든)' 할일 — 리스트 '오늘' 필터와 동일 기준(배지·완료카드가 리스트와 일치, 문서 features-todo.md).
    var due = (todos || []).filter(function (t) { return t && (!t.dueDate || t.dueDate <= today); });
    var todosPending = due.filter(function (t) { return !t.done; }).length;
    var total = missions + todosPending;
    return { missions: missions, todos: todosPending, total: total, allDone: total === 0, any: missionsTotal > 0 || due.length > 0 };
  }
  // 🚨 RTDB rooms 형태 견고화: Firebase는 JS 배열을 보존하지 않는다 — 키가 연속이면 배열, sparse면 객체({"1":{…}}),
  //  앞/중간이 비면 null 구멍 배열([null,{…}])로 내려준다. 이를 어떤 형태든 '존재하는 방'을 잃지 않고 dense 배열로 복원한다.
  //  (예전 버그: normalizeHome이 Array.isArray만 보고 객체형이면 레거시 flat으로 붕괴 → 멀티룸 배치 전멸. null 구멍이면 유령 빈 방 생성.)
  //  반환: 방 객체 배열(존재하는 방만) 또는 null(진짜 방 데이터 없음 → 레거시 flat/신규 처리로 위임).
  function toRoomsArray(hr) {
    var arr;
    if (Array.isArray(hr)) arr = hr;
    else if (hr && typeof hr === 'object') {
      var keys = Object.keys(hr).filter(function (k) { return /^\d+$/.test(k); }).sort(function (a, b) { return a - b; });
      if (!keys.length) return null;
      arr = keys.map(function (k) { return hr[k]; });
    } else return null;
    var dense = arr.filter(function (r) { return r && typeof r === 'object'; });   // null 구멍·비객체만 제거(정규화된 방은 name/wallpaper 문자열이라 RTDB에서 null이 안 됨 → 제거되는 건 이미 사라진 데이터뿐)
    return dense.length ? dense : null;
  }
  // ===== 알뜰홈 여러 방(프리셋) — home 상태 정규화(순수). 레거시 flat(단일 방)과 신규 rooms[] 둘 다 받아 rooms 형태로. =====
  //  방별: {name,wallpaper,placed,active,poops}. 전역: current(선택 방), roomSlots(열린 방수), slots(방당 펫상한), changedAt.
  //  opts={baseRooms,maxRooms,baseSlots,maxSlots}(기본 1/5/3/20). 데이터 손실 방지: 방 데이터가 roomSlots보다 많으면 roomSlots를 올린다.
  // 바닥 배치(placed)의 행(r)을 [1,rows]로 클램프 — 깊이 격자 12→8행 축소 마이그레이션(순수).
  //   기존 앞쪽 행(r>rows=8~12)은 맨앞행(rows)으로 모인다(큰 r=앞이라 "앞 가구는 앞에" 유지). 열(c)은 불변(가로 12칸).
  //   r≤rows면 그대로라 재적용해도 안전(idempotent). 충돌(같은 r_c로 겹침)은 먼저 온 항목 유지.
  function clampPlacedRows(placed, rows) {
    if (!placed || typeof placed !== 'object') return {};
    var out = {};
    Object.keys(placed).forEach(function (k) {
      var pr = String(k).split('_'), r = Math.floor(+pr[0]), c = Math.floor(+pr[1]);
      if (!(r >= 1) || !(c >= 1)) return;                 // 손상 키 제거
      var nr = Math.min(Math.max(1, r), rows);
      var nk = nr + '_' + c;
      if (!out[nk]) out[nk] = placed[k];                  // 충돌 시 먼저 온 것 유지
    });
    return out;
  }
  function normalizeHome(home, opts) {
    opts = opts || {};
    var BASE = Number(opts.baseRooms) || 1, MAX = Number(opts.maxRooms) || 5;
    var BS = Number(opts.baseSlots) || 3, MS = Number(opts.maxSlots) || 20;
    var h = home || {};
    function clamp(n, lo, hi) { n = Math.floor(Number(n) || 0); return Math.max(lo, Math.min(hi, n)); }
    function normRoom(r, i) {
      r = r || {};
      return {
        id: (typeof r.id === 'string' && r.id) ? r.id : '',   // 안정적 방 식별자(빈값=미부여 → cats.js ensureRoomIds가 채움). 방별 쓰기를 인덱스가 아닌 id로 하여 재정렬 경합 방지
        name: (typeof r.name === 'string' && r.name) ? r.name : ('방 ' + (i + 1)),
        emoji: (typeof r.emoji === 'string') ? r.emoji : '',
        wallpaper: r.wallpaper || 'default',
        placed: clampPlacedRows(r.placed, CAM.ROWS),   // 깊이 12→8행 마이그레이션: 레거시 행(r>8)을 맨앞행(8)으로 클램프. 비파괴(읽기 시)·idempotent(r≤8은 그대로). 첫 배치/이동 트랜잭션에서 정규화된 채 영속.
        wallPlaced: (r.wallPlaced && typeof r.wallPlaced === 'object') ? r.wallPlaced : {},   // 벽꾸미기(벽 격자) 배치 — placed(바닥)와 별개
        active: Array.isArray(r.active) ? r.active.slice() : [],
        poops: Number(r.poops) || 0,
        floor: r.floor || 'default',
        bgfx: (typeof r.bgfx === 'string') ? r.bgfx : '',   // 배경효과(앰비언트 오버레이) id — 없으면 ''
        harvestAt: Number(r.harvestAt) || 0,   // 🌾 방별 마지막 수확 시각(ms). 유휴 가구수익 누적 기준(0=미시작 → cats.js가 now로 초기화)
        caredAt: Number(r.caredAt) || 0,   // ❤️ 마지막 '실제 수확(버튼)' 시각(ms). 행복도 수확신선도 기준(0=아직 안 함 → 수확 보너스 없음)
        drops: normDrops(r.drops)   // 🎁 방 바닥 대기 드랍(실시간 스폰) — [{id,kind,at,r,c}] 최대 3개
      };
    }
    // 대기 드랍 정규화: 유효 kind만, 격자 클램프, 방당 3개 절단. RTDB 어떤 형태(배열/객체)든 안전 복원.
    function normDrops(d) {
      var KINDS = { egg: 1, box: 1, ddeul: 1, gold: 1 };
      var arr = Array.isArray(d) ? d : (d && typeof d === 'object' ? Object.keys(d).map(function (k) { return d[k]; }) : []);
      var out = [];
      arr.forEach(function (x) {
        if (!x || typeof x.id !== 'string' || !x.id || !KINDS[x.kind]) return;
        if (out.length >= 3) return;
        out.push({ id: x.id, kind: x.kind, at: Number(x.at) || 0,
          r: clamp(x.r, 1, CAM.ROWS), c: clamp(x.c, 1, 12) });
      });
      return out;
    }
    var roomsArr = toRoomsArray(h.rooms);   // 배열/객체/null구멍 어떤 RTDB 형태든 안전 복원(붕괴·유령방 방지)
    var rooms = (roomsArr && roomsArr.length)
      ? roomsArr.map(normRoom)
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
  // 바닥(placed)+벽(wallPlaced) 둘 다 합산 — 한 아이템은 바닥 또는 벽 한쪽에만 놓이므로 양쪽을 더해도 이중집계 안 됨.
  function sumPlacedItem(rooms, id) {
    var n = 0; (rooms || []).forEach(function (r) {
      var p = (r && r.placed) || {}; for (var k in p) { if (p[k] && p[k].itemId === id) n++; }
      var w = (r && r.wallPlaced) || {}; for (var wk in w) { if (w[wk] && w[wk].itemId === id) n++; }
    }); return n;
  }

  // ===== 🧱 벽꾸미기(벽 격자) 순수 로직 — 격자 cols/rows·발자국 너비(footW)를 인자로 받아 DOM/카탈로그 비의존(단위 테스트 가능). cats.js 가 얇은 래퍼로 카탈로그 값을 주입해 호출한다. =====
  // placed = { "r_c": {itemId} } (r=행 1..rows·c=열 1..cols), footW = function(itemId)->가로 점유 칸수, ignoreKey = 이동 중 자기 제외.
  function wallOccupiedCellsPure(placed, ignoreKey, footW) {
    var occ = {};
    Object.keys(placed || {}).forEach(function (k) {
      if (k === ignoreKey) return;
      var pr = k.split('_'), r = +pr[0], c = +pr[1], w = footW(placed[k].itemId);
      for (var dc = 0; dc < w; dc++) occ[r + '_' + (c + dc)] = 1;
    });
    return occ;
  }
  // (r,c)에서 가로 w칸이 격자(cols×rows) 안에 들어가고 다른 가구와 안 겹치는지.
  function wallAreaFreePure(r, c, w, placed, ignoreKey, footW, cols, rows) {
    if (r < 1 || c < 1 || r > rows || c + w - 1 > cols) return false;
    var occ = wallOccupiedCellsPure(placed, ignoreKey, footW);
    for (var dc = 0; dc < w; dc++) if (occ[r + '_' + (c + dc)]) return false;
    return true;
  }
  // 바닥형(floor) 앵커 벽 가구는 항상 맨 아래 행(rows)에 스냅, 그 외 앵커는 요청 행 그대로.
  function wallSnapRowPure(anchor, r, rows) {
    return anchor === 'floor' ? rows : r;
  }

  // ===== 게임 리텐션(순수) =====
  // 로그인(출석) 연속일 → 마일스톤 보상 {coins,gold}. 마일스톤(3·7·14·30)에서만 지급, 30 이후는 매 30일 반복.
  function loginStreakReward(day) {
    day = Math.floor(Number(day) || 0);
    // 경제 정책(economy-policy §3-E): 넉넉한 출석 보상. 마일스톤 3·7·14·30·60·100일, 100일 이후는 매 100일 반복.
    var table = { 3: { coins: 50, gold: 0 }, 7: { coins: 100, gold: 2 }, 14: { coins: 200, gold: 3 }, 30: { coins: 400, gold: 6 }, 60: { coins: 600, gold: 10 }, 100: { coins: 1000, gold: 15 } };
    if (table[day]) return table[day];
    if (day > 100 && day % 100 === 0) return table[100];
    return { coins: 0, gold: 0 };
  }
  // 컬렉션 도감 진행도. owned=보유 맵(catId→...), catalogIds=전체 펫 id 배열.
  function dexProgress(owned, catalogIds) {
    var ids = catalogIds || [], o = 0;
    ids.forEach(function (id) { if (owned && owned[id]) o++; });
    return { owned: o, total: ids.length, pct: ids.length ? Math.round(o / ids.length * 100) : 0 };
  }
  // 펫 애정도 레벨(임계 1/3/7/14/21 — 최대 5레벨). 하루 1번 쓰다듬기 +1 → 첫 쓰다듬기에 바로 Lv.1, 이후 3·7·14·21일 누적. {level(0~5), next(다음 임계 or null), pct(다음까지 %)}.
  function affectionLevel(aff) {
    aff = Math.max(0, Math.floor(Number(aff) || 0));
    var TH = [1, 3, 7, 14, 21], level = 0;
    for (var i = 0; i < TH.length; i++) { if (aff >= TH[i]) level = i + 1; }
    var prev = level > 0 ? TH[level - 1] : 0, next = level < TH.length ? TH[level] : null;
    return { level: level, next: next, pct: next != null ? Math.round((aff - prev) / (next - prev) * 100) : 100 };
  }
  // ===== 가챠 천장(pity·순수) — '가챠 종류마다' 독립 카운터 =====
  // pity = 그 종류의 마지막 신화↑(limited/exclusive) 이후 누적 뽑기 수. N회째(기본 100) 뽑기까지 신화↑가 안 나오면 그 뽑기를 강제 확정.
  // 강제 여부만 판정(true) — 강제 등급은 호출측(cats.js)이 결정: 뜰알=신화50%·한정50%, 그 외=신화(limited).
  var PITY_N = 100;
  function pityForced(pity, n) {
    n = Math.floor(Number(n) || 0) || PITY_N;
    return (Math.floor(Number(pity) || 0) + 1) >= n;
  }
  // 뽑기 후 pity 갱신: 신화↑(신화·한정) 나왔으면 0으로 리셋, 아니면 +1.
  function pityNext(pity, hitTopTier) {
    return hitTopTier ? 0 : (Math.floor(Number(pity) || 0) + 1);
  }
  // 신화↑ 확정까지 남은 뽑기 수(표기용).
  function pityRemain(pity, n) {
    n = Math.floor(Number(n) || 0) || PITY_N;
    return Math.max(0, n - Math.floor(Number(pity) || 0));
  }

  // ===== 🌾 알뜰홈 유휴 가구수익(순수) =====
  // 🌾 자동 은화 수확 — 행복도(mood)가 수익의 엔진. 잘 돌본 행복한 방일수록 많이·오래 벌고, 방치하면 적게 번다(다마고치).
  //   affLevels=활성 펫 애정레벨 배열, mood=방 행복도(0~100), elapsedMs=마지막 수확 후 경과, mult=전역 수익배율(yieldMultiplier).
  //   가구 '수' 배율은 제거(도배 방지) — 가구는 행복도의 enrichment(종류)로만 반영. 누적 상한 24h(하루 한 번 들르는 다마고치 리듬).
  function roomYieldCapH() { return 24; }
  // 펫당 시간당 은화 = YIELD_BASE + 애정레벨×YIELD_PER_LV. (가구배율 제거분 보정해 상향)
  // 경제 정책(economy-policy §3-C): 수확 은화 기본량 상향 — 3펫·고애정 기준 하루 ~130~155 목표(24h캡). 0.3→0.5.
  var YIELD_BASE = 0.5, YIELD_PER_LV = 0.25;
  function roomYield(affLevels, mood, elapsedMs, mult) {
    affLevels = affLevels || [];
    if (!affLevels.length) return 0;   // 펫 없으면 0
    var hrs = Math.max(0, Math.min(roomYieldCapH(), (Number(elapsedMs) || 0) / 3600000));
    var perHr = 0; for (var i = 0; i < affLevels.length; i++) perHr += YIELD_BASE + Math.max(0, Math.min(5, Math.floor(Number(affLevels[i]) || 0))) * YIELD_PER_LV;
    var happyFactor = 0.2 + 0.8 * Math.max(0, Math.min(100, Number(mood) || 0)) / 100;   // 행복도 0→0.2배 … 100→1.0배
    var m = (mult == null) ? 1 : Math.max(0, Number(mult) || 0);
    return Math.floor(perHr * happyFactor * m * hrs);
  }
  // 🌱 소유 펫 전체 애정레벨 합(0~5 각). 수익배율(총 애정 축)·성장 지표용. catsMap = owned.cats.
  function totalAffectionLv(catsMap) {
    catsMap = catsMap || {}; var s = 0;
    for (var k in catsMap) { if (Object.prototype.hasOwnProperty.call(catsMap, k)) s += affectionLevel((catsMap[k] || {}).affection || 0).level; }
    return s;
  }
  // 🔺 자동 은화 수익배율(1.0~2.0) — 애정 총량 + 도감 수집률 + 실제 앱 사용(가계부·할일 기록). 게임 성장과 실사용을 동시에 권장.
  //   dexPct=도감 수집률(0~100), totalAffLv=소유 펫 애정레벨 합, recordDaysWk=이번 주 기록한 일수(0~7), recordedToday=오늘 기록 여부.
  function yieldMultiplier(dexPct, totalAffLv, recordDaysWk, recordedToday) {
    var affB = Math.min(0.40, Math.max(0, Number(totalAffLv) || 0) / 60 * 0.40);          // 총 애정레벨, 60에서 포화 → +0.40
    var dexB = Math.max(0, Math.min(100, Number(dexPct) || 0)) / 100 * 0.35;              // 도감 수집률 → +0.35
    var useB = (recordedToday ? 0.15 : 0)                                                 // 🍀 오늘 기록 → 즉시 +0.15(그날 부스트)
             + Math.min(0.10, Math.max(0, Number(recordDaysWk) || 0) / 7 * 0.10);         // 주간 기록 습관 → +0.10
    return 1 + affB + dexB + useB;                                                        // 1.0 … 2.0
  }
  // 방 행복도(0~100, 표시용·순수·별도 저장 없음). 입력 객체:
  //   pets=활성 펫 수(0이면 0), furn=enrichment 가구 '종류' 수(도배 방지: 2종에서 포화), feedFrac=밥·물 신선도(0~1),
  //   avgAff=활성 펫 평균 애정레벨(0~5), caredFresh=수확 신선도(0~1, 수확 직후 1→24h 후 0), poops=똥 수.
  // 설계: 돌봄(밥물·수확신선)+사랑(애정)+가벼운 enrichment(가구 1~2종이면 충분)로 100. 가구 도배는 무의미. 방치하면 밥물(3h)·수확(24h) 신선도가 빠져 하강.
  function roomMood(inp) {
    inp = inp || {};
    var pets = Math.max(0, Math.floor(Number(inp.pets) || 0)); if (!pets) return 0;
    var enrich = Math.max(0, Math.floor(Number(inp.furn) || 0));   // enrichment 종류 수(furn 필드 재해석)
    var feedFrac = Math.max(0, Math.min(1, Number(inp.feedFrac) || 0));
    var avgAff = Math.max(0, Math.min(5, Number(inp.avgAff) || 0));
    var caredFresh = Math.max(0, Math.min(1, Number(inp.caredFresh) || 0));
    var poops = Math.max(0, Math.floor(Number(inp.poops) || 0));
    var m = 20                            // 방에 살아있는 펫(베이스)
          + Math.min(2, enrich) * 12      // enrichment: 종류당 12, 2종에서 포화(0/12/24 — 도배 무의미)
          + 28 * feedFrac                 // 밥·물 신선도(가장 큰 능동 레버)
          + 16 * (avgAff / 5)             // 애정(사랑)
          + 12 * caredFresh;              // 수확 신선도(들러 수확해야 유지)
    m -= Math.min(30, poops * 6);         // 똥 감점
    return Math.max(0, Math.min(100, Math.round(m)));
  }
  // 애정 레벨업 소보상(은화). 레벨 1~5 = 20·30·50·80·100. (금화 만렙 보상은 별도 유지)
  function affLevelReward(level) {
    var t = { 1: 20, 2: 30, 3: 50, 4: 80, 5: 100 };
    return t[Math.floor(Number(level) || 0)] || 0;
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
    if (!doc) return; var brand = doc.querySelector('.brand'); if (!brand) return;
    var b = brand.querySelector('.home-badge'), show = homeBadgeShow(view, total);
    // 배지 엘리먼트가 없으면 생성(applyTodoTabDot과 동일 패턴) — index.html에 정적 엘리먼트가 없어 '오늘 미처리' 점이 안 뜨던 죽은 기능 수정.
    if (show) { if (!b) { b = doc.createElement('span'); b.className = 'home-badge'; b.setAttribute('aria-label', '오늘 미처리 있음'); brand.appendChild(b); } b.hidden = false; }
    else if (b) b.hidden = true;
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

  var api = { CAM: CAM, camDepth: camDepth, camFurnBottom: camFurnBottom, camZ: camZ, CURRENCIES: CURRENCIES, won: won, fmtComma: fmtComma, fmtCommaSigned: fmtCommaSigned, parseAmount: parseAmount, parseAmountSigned: parseAmountSigned, todayKst: todayKst, isoAtNoon: isoAtNoon, jsAttr: jsAttr, curInfo: curInfo, fmtForeign: fmtForeign, krwFromForeign: krwFromForeign, sumByCurrency: sumByCurrency, computeSettleAmounts: computeSettleAmounts, personKey: personKey, addDays: addDays, nextDue: nextDue, dueDiffDays: dueDiffDays, clampYmd: clampYmd, effNextBilling: effNextBilling, todoScope: todoScope, overdueTodoIds: overdueTodoIds, friendTodoOrder: friendTodoOrder, friendFeedOrder: friendFeedOrder, storyRing: storyRing, relTime: relTime, missionStreak: missionStreak, weekDotsData: weekDotsData, todayMissionState: todayMissionState, customMissionMilestone: customMissionMilestone, normalizeHome: normalizeHome, toRoomsArray: toRoomsArray, sumPlacedItem: sumPlacedItem, wallOccupiedCellsPure: wallOccupiedCellsPure, wallAreaFreePure: wallAreaFreePure, wallSnapRowPure: wallSnapRowPure, loginStreakReward: loginStreakReward, dexProgress: dexProgress, affectionLevel: affectionLevel, PITY_N: PITY_N, pityForced: pityForced, pityNext: pityNext, pityRemain: pityRemain, roomYield: roomYield, roomYieldCapH: roomYieldCapH, roomMood: roomMood, yieldMultiplier: yieldMultiplier, totalAffectionLv: totalAffectionLv, affLevelReward: affLevelReward, frequentTxTemplates: frequentTxTemplates, txMatches: txMatches, todayPending: todayPending, homeBadgeShow: homeBadgeShow, homeCardKind: homeCardKind, applyHomeBadge: applyHomeBadge, applyTodoTabDot: applyTodoTabDot, featuredPetOfMonth: featuredPetOfMonth, FREE_GIFT_TABLE: FREE_GIFT_TABLE, rollFreeGift: rollFreeGift };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  for (var k in api) { root[k] = api[k]; }   // 브라우저 전역 노출(기존 코드가 전역으로 참조)
})(typeof window !== 'undefined' ? window : globalThis);
