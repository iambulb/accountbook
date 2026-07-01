/* 알뜰집(Eggarden) 서비스워커 — 오프라인 앱 셸 캐시 */
const CACHE_VERSION = 'eggarden-v3.48.0';
const APP_SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './js/firebase.js',
  './js/constants.js',
  './js/core.js',
  './js/views.js',
  './js/cats.js',
  './js/main.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/coin.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/pets/cat_mackerel/walk.png',
  './assets/pets/cat_mackerel/south.png',
  './assets/pets/cat_mackerel/north.png',
  './assets/pets/cat_mackerel/east.png',
  './assets/pets/cat_mackerel/west.png',
  './assets/pets/cat_cheese/walk.png',
  './assets/pets/cat_cheese/south.png',
  './assets/pets/cat_cheese/north.png',
  './assets/pets/cat_cheese/east.png',
  './assets/pets/cat_cheese/west.png',
  './assets/pets/cat_white/walk.png',
  './assets/pets/cat_white/south.png',
  './assets/pets/cat_white/north.png',
  './assets/pets/cat_white/east.png',
  './assets/pets/cat_white/west.png',
  './assets/pets/cat_tuxedo/walk.png',
  './assets/pets/cat_tuxedo/south.png',
  './assets/pets/cat_tuxedo/north.png',
  './assets/pets/cat_tuxedo/east.png',
  './assets/pets/cat_tuxedo/west.png',
  './assets/pets/cat_calico/walk.png',
  './assets/pets/cat_calico/south.png',
  './assets/pets/cat_calico/north.png',
  './assets/pets/cat_calico/east.png',
  './assets/pets/cat_calico/west.png',
  './assets/pets/cat_black/walk.png',
  './assets/pets/cat_black/south.png',
  './assets/pets/cat_black/north.png',
  './assets/pets/cat_black/east.png',
  './assets/pets/cat_black/west.png'
];

// CDN(라이브러리)은 cache-first 로 따로 보관
const CDN_HOSTS = ['www.gstatic.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Firebase 실시간 데이터/인증은 절대 캐시하지 않음 (항상 네트워크)
  if (/firebaseio\.com$|firebasedatabase\.app$|googleapis\.com$|identitytoolkit|firebaseapp\.com$/.test(url.hostname)) {
    return; // 브라우저 기본 처리
  }

  // CDN 라이브러리: cache-first
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async cache => {
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        } catch (e) {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // 같은 출처(앱 셸): stale-while-revalidate, 네비게이션은 index.html 폴백
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async cache => {
        const cached = await cache.match(req);
        const network = fetch(req).then(res => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(() => null);
        if (cached) { network; return cached; }
        const res = await network;
        if (res) return res;
        if (req.mode === 'navigate') {
          return (await cache.match('./index.html')) || Response.error();
        }
        return Response.error();
      })
    );
  }
});
