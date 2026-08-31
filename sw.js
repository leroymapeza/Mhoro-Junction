var CACHE = 'mhoro-v1';
var FILES = ['./', 'index.html', 'manifest.json'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.map(function (n) {
          if (n !== CACHE) return caches.delete(n);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      return r || fetch(e.request).then(function (resp) {
        return caches.open(CACHE).then(function (c) {
          c.put(e.request, resp.clone());
          return resp;
        });
      });
    }).catch(function () {
      return caches.match('./');
    })
  );
});