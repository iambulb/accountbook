/* 알뜰(Eggarden) FCM 백그라운드 서비스워커 — 앱이 닫혀 있을 때 푸시 알림 표시.
   FCM이 자체 스코프(/firebase-cloud-messaging-push-scope)로 등록하므로 앱 셸 sw.js(/ 스코프)와 충돌하지 않는다.
   ※ SW라 firebase.js를 import 못 함 → config 인라인(공개 웹 키). */
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAn2emAQiftfzSxmc0vmB72ekcAAGVOPuk',
  authDomain: 'money-bb658.firebaseapp.com',
  projectId: 'money-bb658',
  messagingSenderId: '21675556596',
  appId: '1:21675556596:web:63c21cd0a9777bd06aa8a1'
});

const messaging = firebase.messaging();

// 백그라운드 데이터/알림 메시지 → 알림 표시
messaging.onBackgroundMessage(function (payload) {
  const n = (payload && (payload.notification || payload.data)) || {};
  self.registration.showNotification(n.title || '알뜰', {
    body: n.body || '',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: n.tag || 'altteul',
    data: { url: (n.url || (payload && payload.data && payload.data.url) || './') }
  });
});

// 알림 탭 → 앱 열기(이미 열려 있으면 포커스)
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (const c of list) { if ('focus' in c) { try { c.navigate(url); } catch (e) {} return c.focus(); } }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
