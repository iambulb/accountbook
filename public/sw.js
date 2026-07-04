/* 알뜰(Eggarden) 서비스워커 — 오프라인 앱 셸 캐시 */
const CACHE_VERSION = 'eggarden-v3.279.0';
const APP_SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './js/firebase.js',
  './js/constants.js',
  './js/util.js',
  './js/core.js',
  './js/views.js',
  './js/cats.js',
  './js/push.js',
  './js/main.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/coin.svg',
  './icons/egg-garden.svg',
  './icons/auth-sky.svg',
  './icons/wordmark-altteul.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/fx/gachacat/walk.png',
  './assets/fx/gachacat/still.png',
  // @gen:pet-shell — 자동생성(tools/build_pets.py). tools/pets.json 편집 후 재실행.
  './assets/pets/cat/cat_mackerel/walk.png',
  './assets/pets/cat/cat_mackerel/south.png',
  './assets/pets/cat/cat_mackerel/north.png',
  './assets/pets/cat/cat_mackerel/east.png',
  './assets/pets/cat/cat_mackerel/west.png',
  './assets/pets/cat/cat_cheese/walk.png',
  './assets/pets/cat/cat_cheese/south.png',
  './assets/pets/cat/cat_cheese/north.png',
  './assets/pets/cat/cat_cheese/east.png',
  './assets/pets/cat/cat_cheese/west.png',
  './assets/pets/cat/cat_calico/walk.png',
  './assets/pets/cat/cat_calico/south.png',
  './assets/pets/cat/cat_calico/north.png',
  './assets/pets/cat/cat_calico/east.png',
  './assets/pets/cat/cat_calico/west.png',
  './assets/pets/cat/cat_black/walk.png',
  './assets/pets/cat/cat_black/south.png',
  './assets/pets/cat/cat_black/north.png',
  './assets/pets/cat/cat_black/east.png',
  './assets/pets/cat/cat_black/west.png',
  './assets/pets/cat/cat_white/walk.png',
  './assets/pets/cat/cat_white/south.png',
  './assets/pets/cat/cat_white/north.png',
  './assets/pets/cat/cat_white/east.png',
  './assets/pets/cat/cat_white/west.png',
  './assets/pets/cat/cat_fluffy/walk.png',
  './assets/pets/cat/cat_fluffy/south.png',
  './assets/pets/cat/cat_fluffy/north.png',
  './assets/pets/cat/cat_fluffy/east.png',
  './assets/pets/cat/cat_fluffy/west.png',
  './assets/pets/cat/cat_tuxedo/walk.png',
  './assets/pets/cat/cat_tuxedo/south.png',
  './assets/pets/cat/cat_tuxedo/north.png',
  './assets/pets/cat/cat_tuxedo/east.png',
  './assets/pets/cat/cat_tuxedo/west.png',
  './assets/pets/cat/cat_chaos/walk.png',
  './assets/pets/cat/cat_chaos/south.png',
  './assets/pets/cat/cat_chaos/north.png',
  './assets/pets/cat/cat_chaos/east.png',
  './assets/pets/cat/cat_chaos/west.png',
  './assets/pets/cat/cat_siamese/walk.png',
  './assets/pets/cat/cat_siamese/south.png',
  './assets/pets/cat/cat_siamese/north.png',
  './assets/pets/cat/cat_siamese/east.png',
  './assets/pets/cat/cat_siamese/west.png',
  './assets/pets/cat/cat_bengal/walk.png',
  './assets/pets/cat/cat_bengal/south.png',
  './assets/pets/cat/cat_bengal/north.png',
  './assets/pets/cat/cat_bengal/east.png',
  './assets/pets/cat/cat_bengal/west.png',
  './assets/pets/cat/cat_fold/walk.png',
  './assets/pets/cat/cat_fold/south.png',
  './assets/pets/cat/cat_fold/north.png',
  './assets/pets/cat/cat_fold/east.png',
  './assets/pets/cat/cat_fold/west.png',
  './assets/pets/cat/cat_bora/walk.png',
  './assets/pets/cat/cat_bora/south.png',
  './assets/pets/cat/cat_bora/north.png',
  './assets/pets/cat/cat_bora/east.png',
  './assets/pets/cat/cat_bora/west.png',
  './assets/pets/cat/cat_choco/walk.png',
  './assets/pets/cat/cat_choco/south.png',
  './assets/pets/cat/cat_choco/north.png',
  './assets/pets/cat/cat_choco/east.png',
  './assets/pets/cat/cat_choco/west.png',
  './assets/pets/cat/cat_kitten/walk.png',
  './assets/pets/cat/cat_kitten/south.png',
  './assets/pets/cat/cat_kitten/north.png',
  './assets/pets/cat/cat_kitten/east.png',
  './assets/pets/cat/cat_kitten/west.png',
  './assets/pets/cat/cat_pink/walk.png',
  './assets/pets/cat/cat_pink/south.png',
  './assets/pets/cat/cat_pink/north.png',
  './assets/pets/cat/cat_pink/east.png',
  './assets/pets/cat/cat_pink/west.png',
  './assets/pets/tiger/tiger_orange/walk.png',
  './assets/pets/tiger/tiger_orange/south.png',
  './assets/pets/tiger/tiger_orange/north.png',
  './assets/pets/tiger/tiger_orange/east.png',
  './assets/pets/tiger/tiger_orange/west.png',
  './assets/pets/lion/lion_mane/walk.png',
  './assets/pets/lion/lion_mane/south.png',
  './assets/pets/lion/lion_mane/north.png',
  './assets/pets/lion/lion_mane/east.png',
  './assets/pets/lion/lion_mane/west.png',
  './assets/pets/cat/cat_persian/walk.png',
  './assets/pets/cat/cat_persian/south.png',
  './assets/pets/cat/cat_persian/north.png',
  './assets/pets/cat/cat_persian/east.png',
  './assets/pets/cat/cat_persian/west.png',
  './assets/pets/tiger/tiger_white/walk.png',
  './assets/pets/tiger/tiger_white/south.png',
  './assets/pets/tiger/tiger_white/north.png',
  './assets/pets/tiger/tiger_white/east.png',
  './assets/pets/tiger/tiger_white/west.png',
  './assets/pets/cat/cat_russianblue/walk.png',
  './assets/pets/cat/cat_russianblue/south.png',
  './assets/pets/cat/cat_russianblue/north.png',
  './assets/pets/cat/cat_russianblue/east.png',
  './assets/pets/cat/cat_russianblue/west.png',
  './assets/pets/cat/cat_bengal2/walk.png',
  './assets/pets/cat/cat_bengal2/south.png',
  './assets/pets/cat/cat_bengal2/north.png',
  './assets/pets/cat/cat_bengal2/east.png',
  './assets/pets/cat/cat_bengal2/west.png',
  './assets/pets/dog/dog_mutt/walk.png',
  './assets/pets/dog/dog_mutt/south.png',
  './assets/pets/dog/dog_mutt/north.png',
  './assets/pets/dog/dog_mutt/east.png',
  './assets/pets/dog/dog_mutt/west.png',
  './assets/pets/cat/cat_panther/walk.png',
  './assets/pets/cat/cat_panther/south.png',
  './assets/pets/cat/cat_panther/north.png',
  './assets/pets/cat/cat_panther/east.png',
  './assets/pets/cat/cat_panther/west.png',
  // @gen:end
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
  if (/firebaseio\.com$|firebasedatabase\.app$|googleapis\.com$|identitytoolkit|firebaseapp\.com$|frankfurter\.(app|dev)$/.test(url.hostname)) {
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
