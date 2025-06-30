self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('foodmed-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/static/js/main.js',     
        '/static/css/main.css',
        '/icon/android-chrome-192x192.png',
        '/icon/android-chrome-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
