/* 알뜰(Eggarden) 웹 푸시(FCM) 클라이언트 — 알림 켜기/끄기·토큰 저장·포그라운드 수신.
   서버리스 유지: 발송은 GitHub Actions 스케줄 크론(tools/send_reminders.mjs)이 FCM HTTP v1로 함.
   활성 조건: firebase.js VAPID_KEY 채움 + firebase-messaging-compat.js 로드 + 브라우저 지원 + 사용자 권한.
   ⚠️ iOS는 홈화면에 설치한 PWA(iOS 16.4+)에서만 웹 푸시가 동작한다(설치 안 하면 지원 안 함). */
(function () {
  'use strict';
  let _msg = null, _supported = null;

  function pushConfigured() { return typeof VAPID_KEY === 'string' && VAPID_KEY.length > 20; }
  function pushApiOk() {
    return typeof firebase !== 'undefined' && firebase.messaging && 'Notification' in window
      && 'serviceWorker' in navigator && 'PushManager' in window;
  }
  // 지원 여부(비동기, 캐시). firebase.messaging.isSupported()는 Promise.
  async function pushSupported() {
    if (_supported != null) return _supported;
    if (!pushConfigured() || !pushApiOk()) return (_supported = false);
    try { _supported = await firebase.messaging.isSupported(); } catch (e) { _supported = false; }
    return _supported;
  }
  function messaging() { if (!_msg) { try { _msg = firebase.messaging(); } catch (e) { _msg = null; } } return _msg; }

  // 현재 상태: 'unsupported' | 'default'(미요청) | 'denied' | 'on'(권한+토큰) | 'off'(권한 있으나 미등록)
  function pushState() {
    if (!pushConfigured() || !pushApiOk()) return 'unsupported';
    const p = Notification.permission;
    if (p === 'denied') return 'denied';
    if (p === 'granted') return (window.state && state._pushToken) ? 'on' : 'off';
    return 'default';
  }
  function pushStatusLabel() {
    switch (pushState()) {
      case 'on': return '켜짐';
      case 'denied': return '차단됨(브라우저 설정)';
      case 'unsupported': return '지원 안 함';
      default: return '꺼짐';
    }
  }

  // 토큰 발급 + 저장(users/{uid}/push). 권한 없으면 요청.
  async function pushEnable() {
    if (!(await pushSupported())) { toast('이 기기·브라우저는 알림을 지원하지 않아요(iOS는 홈화면 설치 필요)', true); return false; }
    let perm = Notification.permission;
    if (perm === 'default') { try { perm = await Notification.requestPermission(); } catch (e) { perm = 'denied'; } }
    if (perm !== 'granted') { toast(perm === 'denied' ? '알림이 차단돼 있어요(브라우저 설정에서 허용)' : '알림 권한이 필요해요', true); return false; }
    const m = messaging(); if (!m) return false;
    try {
      const reg = await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope')
        || await navigator.serviceWorker.ready;
      const token = await m.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
      if (!token) { toast('알림 토큰을 받지 못했어요', true); return false; }
      if (window.state) state._pushToken = token;
      if (state.uid) await db.ref('users/' + state.uid + '/push').set({ token: token, at: new Date().toISOString(), ua: (navigator.userAgent || '').slice(0, 120) });
      toast('알림을 켰어요 🔔');
      return true;
    } catch (e) { toast('알림 설정 실패: ' + ((e && e.message) || e), true); return false; }
  }
  async function pushDisable() {
    try { const m = messaging(); if (m) await m.deleteToken(); } catch (e) {}
    if (window.state) state._pushToken = null;
    try { if (state.uid) await db.ref('users/' + state.uid + '/push').remove(); } catch (e) {}
    toast('알림을 껐어요');
  }
  function togglePush() { if (pushState() === 'on') pushDisable().then(refreshSettings); else pushEnable().then(refreshSettings); }
  function refreshSettings() { try { if (typeof openSettingsSheet === 'function' && document.getElementById('sheet') && document.getElementById('sheet').classList.contains('on')) openSettingsSheet(); } catch (e) {} }

  // 로그인 후: 이미 권한 허용 상태면 토큰을 조용히 갱신(현재 계정으로 재저장). 포그라운드 메시지는 토스트로.
  async function initPush() {
    if (!(await pushSupported())) return;
    const m = messaging(); if (!m) return;
    try {
      m.onMessage(function (payload) {
        const n = (payload && (payload.notification || payload.data)) || {};
        toast('🔔 ' + (n.title || '알뜰') + (n.body ? ' · ' + n.body : ''));
      });
    } catch (e) {}
    if (Notification.permission === 'granted' && state && state.uid) {
      try {
        const reg = await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope') || await navigator.serviceWorker.ready;
        const token = await m.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
        if (token) { state._pushToken = token; db.ref('users/' + state.uid + '/push').set({ token: token, at: new Date().toISOString(), ua: (navigator.userAgent || '').slice(0, 120) }); }
      } catch (e) {}
    }
  }

  // 전역 노출(HTML onclick·core에서 호출)
  window.pushState = pushState; window.pushStatusLabel = pushStatusLabel; window.pushSupported = pushSupported;
  window.pushEnable = pushEnable; window.pushDisable = pushDisable; window.togglePush = togglePush; window.initPush = initPush;
})();
