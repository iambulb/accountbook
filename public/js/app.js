// ===== App 네임스페이스 — MVC 무빌드 인하우스 리팩토링 뼈대 (Phase 0) =====
// 목적: 거대한 전역 스코프를 App.{store, model, view, controller, engine} 계층으로 '점진적으로' 정리한다.
//  · 빌드/번들러 없음 — 각 파일이 window.App = window.App || {} 후 자기 슬라이스를 붙인다(로드 순서는 '호출 시점'에만 의미).
//  · Phase 0은 무동작(byte-equivalent): 기존 전역 state·rerender·라우터를 App 슬라이스로 '별칭'만 하고 동작은 그대로 둔다.
//  · 이후 Phase에서 리스너가 App.store.patch()를, 화면이 App.view.define()/컴포넌트 계약을, 이벤트가 델리게이션을 쓰도록 순차 이관한다.
//  · 로드 위치: core.js 다음(= state/rerender/go 등 전역이 이미 정의된 뒤). index.html·sw.js APP_SHELL 참고.
window.App = window.App || {};
(function (App) {
  'use strict';

  // ── store: 관찰 가능한 상태 — 기존 전역 state(core.js)를 '같은 참조'로 감싼다(형태 하위호환 유지) ──
  var _subs = [];
  App.store = {
    // 기존 전역 state와 동일 객체. cats.js가 state.game.home.rooms를 수백 곳에서 읽으므로 참조/형태를 절대 바꾸지 않는다.
    get state() { return (typeof state !== 'undefined') ? state : undefined; },
    subscribe: function (fn) {
      if (typeof fn === 'function' && _subs.indexOf(fn) < 0) _subs.push(fn);
      return function () { var i = _subs.indexOf(fn); if (i >= 0) _subs.splice(i, 1); };
    },
    // emit: 지금은 기존 rerender(reason)를 그대로 호출 + 구독자 통지(현재 구독자 없음).
    //       Phase 1에서 RTDB 리스너가 'state.X=..; rerender(r)' 대신 App.store.patch(..)를 쓰도록 전환하며 이 지점이 유일한 통지원이 된다.
    emit: function (reason) {
      if (typeof rerender === 'function') rerender(reason);
      for (var i = 0; i < _subs.length; i++) { try { _subs[i](reason); } catch (e) {} }
    },
    // patch: state에 부분 병합 후 emit. 데이터 리스너가 Model→View 직결(rerender 직접호출)하던 것을 대체할 진입점.
    patch: function (partial, reason) {
      if (partial && typeof state !== 'undefined') {
        for (var k in partial) { if (Object.prototype.hasOwnProperty.call(partial, k)) state[k] = partial[k]; }
      }
      App.store.emit(reason);
    }
  };

  // ── controller.router: 기존 라우터 함수의 지연바인딩 별칭(동작 동일) ──
  App.controller = App.controller || {};
  App.controller.router = {
    go:          function () { return (typeof go === 'function') ? go.apply(null, arguments) : undefined; },
    goHome:      function () { return (typeof goHome === 'function') ? goHome.apply(null, arguments) : undefined; },
    goto:        function () { return (typeof goto === 'function') ? goto.apply(null, arguments) : undefined; },
    setMode:     function () { return (typeof setMode === 'function') ? setMode.apply(null, arguments) : undefined; },
    applyMode:   function () { return (typeof applyMode === 'function') ? applyMode.apply(null, arguments) : undefined; },
    renderTabBar:function () { return (typeof renderTabBar === 'function') ? renderTabBar.apply(null, arguments) : undefined; }
  };
  App.controller.actions = App.controller.actions || {};   // Phase 2+ 델리게이션 액션 맵

  // ── model / view / engine: Phase 1+에서 채운다(현재는 뼈대) ──
  App.model = App.model || {};
  App.view = App.view || {};
  App.view.components = App.view.components || {};
  // 컴포넌트 레지스트리(Phase 3+): spec = { render(props)->html, mount?(el), refresh?(el,props), unmount?(el) }
  App.view.define = function (name, spec) { App.view.components[name] = spec; return spec; };
  App.engine = App.engine || {};

  App.version = 'app-namespace/phase0';
})(window.App);
