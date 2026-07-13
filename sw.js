/**
 * CoinRealm Service Worker — 离线缓存静态资源
 */
var CACHE_NAME = 'coinrealm-mobile-v1';
var PRECACHE_URLS = [
  './',
  './index.html',
  './mobile.html',
  './manifest.json',
  './style.css',
  './css/mobile.css',
  './auth.js',
  './app.js',
  './js/mobile.js',
  './js/i18n.js',
  './js/pages/home.js',
  './js/pages/task-detail.js',
  './js/pages/create-task.js',
  './js/pages/submit-task.js',
  './js/pages/profile.js',
  './js/pages/my-tasks.js',
  './js/pages/invite.js',
  './js/pages/review.js',
  './js/pages/publisher.js',
  './js/pages/leaderboard.js',
  './js/pages/dividends.js',
  './js/pages/admin.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS).catch(function (err) {
        console.warn('[sw] 预缓存部分资源失败:', err);
      });
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, clone);
        });
        return response;
      }).catch(function () {
        if (request.mode === 'navigate') {
          return caches.match('./mobile.html');
        }
      });
    })
  );
});
