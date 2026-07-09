// ===== App.model — 데이터 접근(repo) 계층 (Phase 1) =====
// 가계부(ws/{wsId})·워크스페이스·인증의 RTDB 접근을 App.model.* 로 모은다.
//  · 현재는 기존 전역 함수(core.js)의 '지연바인딩 파사드' — 호출부를 점진적으로 App.model.* 로 옮기며 결합을 끊는다.
//  · 로드 위치: core.js·app.js 다음(= wp/attach/db/워크스페이스 함수가 전역에 정의된 뒤). index.html·sw.js 참고.
//  · ⚠️ 게임(users/{uid}/game) repo(gameRepo)는 cats.js 분할(Phase 5)에서 추가한다(현재 cats.js는 진행 중 작업과 겹쳐 손대지 않음).
window.App = window.App || {};
(function (App) {
  'use strict';
  App.model = App.model || {};

  function bind(name) { return function () { return (typeof window[name] === 'function') ? window[name].apply(null, arguments) : undefined; }; }

  // ── ledgerRepo: 가계부 데이터 접근 — 모든 경로는 wp()로 ws/{wsId} 네임스페이스(보안규칙 경계) ──
  App.model.ledgerRepo = {
    wp: bind('wp'),
    wsRoot: bind('wsRoot'),
    attach: bind('attach'),
    setupListeners: bind('setupListeners'),
    detachListeners: bind('detachListeners'),
    // ws 네임스페이스된 ref 헬퍼(쓰기 진입점 — Phase 4에서 views.js의 인라인 db.ref(wp(..)).set 들을 여기로 이관)
    ref: function (path) { return (typeof db !== 'undefined' && typeof wp === 'function') ? db.ref(wp(path)) : undefined; },
    set: function (path, data) { var r = this.ref(path); return r ? r.set(data) : Promise.reject(new Error('no ref')); },
    update: function (path, data) { var r = this.ref(path); return r ? r.update(data) : Promise.reject(new Error('no ref')); },
    remove: function (path) { var r = this.ref(path); return r ? r.remove() : Promise.reject(new Error('no ref')); }
  };

  // ── wsRepo: 워크스페이스 lifecycle(2단계 멤버십 커밋 순서는 기존 함수가 보존) ──
  App.model.wsRepo = {
    loadMyWorkspaces: bind('loadMyWorkspaces'),
    switchWorkspace: bind('switchWorkspace'),
    createPersonalWorkspace: bind('createPersonalWorkspace'),
    createGroupWorkspace: bind('createGroupWorkspace'),
    joinByCode: bind('joinByCode'),
    leaveWorkspace: bind('leaveWorkspace'),
    renameWorkspace: bind('renameWorkspace'),
    saveWsSettings: bind('saveWsSettings')
  };

  // ── authService: 인증/부팅 ──
  App.model.authService = {
    enterApp: bind('enterApp'),
    saveProfile: bind('saveProfile')
  };

  // ── ledgerCalc: 가계부 순수 계산(ledger-calc.js 로 추출, 테스트 대상). 파생 계산(잔액·정산)의 Model API 표면. ──
  App.model.ledgerCalc = {
    settlementSplit: bind('settlementSplit'),
    greedySettle: bind('greedySettle'),
    accountBalance: bind('accountBalance'),   // 순수는 아님(state.transactions 읽음) — 파생 계산 표면으로 노출만
    pbSettleSummary: bind('pbSettleSummary'),
    totalAssets: bind('totalAssets')
  };
})(window.App);
