/* 알뜰(Eggarden) 이벤트 델리게이션 — 인라인 onclick="global()" 을 data-action + 위임 디스패처로 옮기는 다리(리팩토링 Phase 2).
   · 가산적(additive): [data-action] 요소만 처리하고, 기존 인라인 onclick 은 그대로 발화 → 구/신 템플릿 공존, 화면별 점진 이관.
   · 미등록 액션은 같은 이름의 전역 함수로 폴백 → 템플릿이 data-action="saveTx" 만 써도 바로 동작(브리지).
   · 순수 헬퍼(coerceArg/readActionArgs/buildActionAttrs)는 module.exports 로 Node 테스트(test/delegate.test.js).
   · 로드 위치: app.js 다음(window.App 필요). escapeHtml 은 지연바인딩. */
(function (root) {
  'use strict';

  // ── 순수: 인자 타입 강제(data-t0..: n=숫자·b=불리언·j=JSON·기본=문자열) ──
  function coerceArg(v, t) {
    if (t === 'n') return Number(v);
    if (t === 'b') return (v === 'true' || v === '1');
    if (t === 'j') { try { return JSON.parse(v); } catch (e) { return v; } }
    return v;
  }
  // ── 순수: data-a0.. 순서대로 읽어 인자 배열로(접근자 주입 → DOM 없이 테스트 가능) ──
  function readActionArgs(getAttr, hasAttr) {
    var out = [], i = 0;
    while (hasAttr('data-a' + i)) { out.push(coerceArg(getAttr('data-a' + i), getAttr('data-t' + i))); i++; }
    return out;
  }
  // ── 순수: 템플릿용 속성 문자열 생성. args=[값 또는 {v,t}], esc=이스케이프 함수(기본 String), attr=속성 종류('action' 클릭·'change' 변경). ──
  function buildActionAttrs(name, args, esc, attr) {
    esc = esc || function (x) { return String(x); };
    var s = 'data-' + (attr || 'action') + '="' + esc(name) + '"';
    (args || []).forEach(function (a, idx) {
      var v = a, t = '';
      if (a && typeof a === 'object' && 'v' in a) { v = a.v; t = a.t || ''; }
      else if (typeof a === 'number') { t = 'n'; }
      else if (typeof a === 'boolean') { t = 'b'; }
      else if (a === null || a === undefined) { v = 'null'; t = 'j'; }   // null/undefined → JSON 파싱으로 실제 null 복원(문자열 'null'로 새는 것 방지)
      s += ' data-a' + idx + '="' + esc(String(v)) + '"' + (t ? (' data-t' + idx + '="' + t + '"') : '');
    });
    return s;
  }

  var api = { coerceArg: coerceArg, readActionArgs: readActionArgs, buildActionAttrs: buildActionAttrs };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }

  // ── 브라우저 배선: App.controller.delegate + registerActions + App.view.act, 그리고 document 위임 리스너 ──
  if (typeof window !== 'undefined') {
    var App = window.App = window.App || {};
    App.controller = App.controller || {};
    App.controller.actions = App.controller.actions || {};
    App.controller.registerActions = function (map) { for (var k in map) { if (Object.prototype.hasOwnProperty.call(map, k)) App.controller.actions[k] = map[k]; } };
    // 공용 UI 액션: 토글 스위치(.switch) — 인라인 onclick="this.classList.toggle('on')" 대체. this=클릭된 스위치, follow=토글 후 호출할 전역 함수명(선택).
    App.controller.registerActions({
      toggleSwitch: function (follow) {
        if (this && this.classList) this.classList.toggle('on');
        if (follow && typeof window[follow] === 'function') window[follow]();
      }
    });
    App.controller.delegate = {
      // 액션 이름 → 함수: 등록된 액션 우선, 없으면 동명 전역 함수 폴백(점진 이관 다리)
      resolve: function (name) { return App.controller.actions[name] || (typeof window[name] === 'function' ? window[name] : null); },
      // 공통 디스패치: 지정 속성(data-action/data-change)에서 가장 가까운 요소를 찾아 인자강제 후 호출
      dispatch: function (attr, e) {
        var tg = e.target; if (!tg || !tg.closest) return;
        var el = tg.closest('[' + attr + ']'); if (!el) return;
        var fn = App.controller.delegate.resolve(el.getAttribute(attr)); if (!fn) return;
        return fn.apply(el, readActionArgs(function (n) { return el.getAttribute(n); }, function (n) { return el.hasAttribute(n); }));
      },
      handle: function (e) { return App.controller.delegate.dispatch('data-action', e); },          // click 전용
      handleChange: function (e) { return App.controller.delegate.dispatch('data-change', e); }     // change 전용(셀렉트·날짜·체크 — click 오발화 방지)
    };
    // 템플릿 헬퍼: App.view.act('setMode','todo') → 'data-action="setMode" data-a0="todo"'. escapeHtml 지연바인딩.
    App.view = App.view || {};
    App.view.act = function (name) {
      var esc = (typeof escapeHtml === 'function') ? escapeHtml : function (x) { return String(x); };
      return buildActionAttrs(name, Array.prototype.slice.call(arguments, 1), esc);
    };
    // 변경 핸들러 헬퍼: App.view.chg('onCurChange') → 'data-change="onCurChange"'. 셀렉트/날짜/체크 onchange 이관용(change에서만 발화).
    App.view.chg = function (name) {
      var esc = (typeof escapeHtml === 'function') ? escapeHtml : function (x) { return String(x); };
      return buildActionAttrs(name, Array.prototype.slice.call(arguments, 1), esc, 'change');
    };
    // 위임 리스너(문서 전체): click=data-action, change=data-change 로 분리 — 셀렉트가 click에도 발화하던 문제 방지. pointerdown 드래그는 엔진 전용 유지.
    if (typeof document !== 'undefined') {
      document.addEventListener('click', App.controller.delegate.handle, false);
      document.addEventListener('change', App.controller.delegate.handleChange, false);
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
