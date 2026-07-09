'use strict';
// 이벤트 위임 디스패처 DOM 검증 — public/js/delegate.js 의 브라우저 배선을 jsdom 창에서 실제 로드해
// "App.view.act()로 만든 요소를 클릭하면 등록 액션/전역 폴백이 인자강제와 함께 호출되는가"를 확인(Phase 3 가드).
// 실행: npm test (node --test). jsdom은 devDependency.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// delegate.js를 window/document가 있는 컨텍스트(jsdom)에서 실행 → 브라우저 배선(App.controller.delegate·App.view.act·document 리스너) 활성화.
function loadDelegate() {
  const dom = new JSDOM('<!DOCTYPE html><body><div id="root"></div></body>', { runScripts: 'outside-only' });
  dom.window.App = {};   // app.js 없이 최소 네임스페이스만 — delegate.js가 슬라이스를 붙임
  dom.window.eval(fs.readFileSync(path.join(__dirname, '../public/js/delegate.js'), 'utf8'));
  return dom;
}

test('위임 디스패치: 전역 폴백 + 등록 액션이 인자강제(n/b)와 함께 호출', () => {
  const dom = loadDelegate();
  const w = dom.window, d = w.document, root = d.getElementById('root');
  const calls = [];
  w.toggleTodo = function (id) { calls.push(['toggleTodo', id, this]); };            // 미등록 → window[name] 폴백
  w.App.controller.registerActions({ todoMoveMonth: function (n) { calls.push(['todoMoveMonth', n]); } });  // 등록 액션 우선
  root.innerHTML =
    '<button ' + w.App.view.act('toggleTodo', 'abc') + '>x</button>' +
    '<button ' + w.App.view.act('todoMoveMonth', -1) + '>y</button>';
  root.children[0].click();
  root.children[1].click();
  assert.deepStrictEqual(calls[0].slice(0, 2), ['toggleTodo', 'abc']);
  assert.strictEqual(calls[0][2], root.children[0], 'this = 클릭된 엘리먼트');
  assert.deepStrictEqual(calls[1], ['todoMoveMonth', -1], 'data-t0=n → 숫자 강제');
});

test('위임: 불리언 인자(setTodoFeed 패턴) 강제', () => {
  const dom = loadDelegate();
  const w = dom.window, d = w.document, root = d.getElementById('root');
  const got = [];
  w.setTodoFeed = function (on) { got.push(on); };
  root.innerHTML = '<button ' + w.App.view.act('setTodoFeed', true) + '>a</button>' +
                   '<button ' + w.App.view.act('setTodoFeed', false) + '>b</button>';
  root.children[0].click(); root.children[1].click();
  assert.deepStrictEqual(got, [true, false]);
});

test('위임: 미등록·미존재 액션은 조용히 무시(throw 없음)', () => {
  const dom = loadDelegate();
  const w = dom.window, d = w.document, root = d.getElementById('root');
  root.innerHTML = '<button ' + w.App.view.act('nope') + '>z</button>';
  assert.doesNotThrow(() => root.children[0].click());
});

test('위임: data-change는 change에서만·data-action은 click에서만 (셀렉트 click 오발화 방지)', () => {
  const dom = loadDelegate();
  const w = dom.window, d = w.document, root = d.getElementById('root');
  const log = [];
  w.onCurChange = function () { log.push('change'); };
  w.clickFn = function () { log.push('click'); };
  root.innerHTML = '<select ' + w.App.view.chg('onCurChange') + '><option>a</option></select>' +
                   '<button ' + w.App.view.act('clickFn') + '>b</button>';
  const sel = root.querySelector('select'), btn = root.querySelector('button');
  sel.dispatchEvent(new w.Event('click', { bubbles: true }));    // 셀렉트 클릭 → 발화 안 함
  assert.deepStrictEqual(log, []);
  sel.dispatchEvent(new w.Event('change', { bubbles: true }));   // 셀렉트 변경 → onCurChange
  assert.deepStrictEqual(log, ['change']);
  btn.dispatchEvent(new w.Event('click', { bubbles: true }));    // 버튼 클릭 → clickFn
  assert.deepStrictEqual(log, ['change', 'click']);
  btn.dispatchEvent(new w.Event('change', { bubbles: true }));   // 버튼 change → 발화 안 함(data-action은 change 미처리)
  assert.deepStrictEqual(log, ['change', 'click']);
});

test('위임: data-t=e 인자에 실제 event 주입(App.view.ev)', () => {
  const dom = loadDelegate();
  const w = dom.window, d = w.document, root = d.getElementById('root');
  let got;
  w.collectDrop = function (ev, rid, did) { got = { isEvent: ev instanceof w.Event, rid: rid, did: did }; };
  root.innerHTML = '<button ' + w.App.view.act('collectDrop', w.App.view.ev, 'r1', 'd2') + '>x</button>';
  root.children[0].click();
  assert.ok(got.isEvent, '0번 인자 = 실제 event 객체');
  assert.strictEqual(got.rid, 'r1');
  assert.strictEqual(got.did, 'd2');
});

test('위임: toggleSwitch 등록액션 — this 스위치 클래스 토글 + 후속 전역함수 호출', () => {
  const dom = loadDelegate();
  const w = dom.window, d = w.document, root = d.getElementById('root');
  let followed = 0;
  w.afterToggle = function () { followed++; };
  root.innerHTML = '<div class="switch" ' + w.App.view.act('toggleSwitch') + '></div>' +
                   '<div class="switch" ' + w.App.view.act('toggleSwitch', 'afterToggle') + '></div>';
  const s1 = root.children[0], s2 = root.children[1];
  s1.click(); assert.ok(s1.classList.contains('on'), '토글 on');
  s1.click(); assert.ok(!s1.classList.contains('on'), '다시 off');
  s2.click(); assert.ok(s2.classList.contains('on') && followed === 1, '토글 + 후속 호출');
});

test('위임: closest로 "가장 가까운 액션"만 — 중첩 시 자식 우선(stopPropagation 대체)', () => {
  const dom = loadDelegate();
  const w = dom.window, d = w.document, root = d.getElementById('root');
  const hit = [];
  w.openTodoEdit = function () { hit.push('edit'); };        // 부모(제목)
  w.openTodoSubtasks = function () { hit.push('subtasks'); };// 자식(하위작업 배지)
  root.innerHTML = '<span ' + w.App.view.act('openTodoEdit', 't1') + '>' +
                   '제목<b ' + w.App.view.act('openTodoSubtasks', 't1') + '>☑</b></span>';
  root.querySelector('b').click();
  assert.deepStrictEqual(hit, ['subtasks'], '자식 배지만 호출(부모 편집 미발화 = stopPropagation 없이 격리)');
});
