const CACHE = 'lous-garden-guide-v2-2026-07-27-photo-fix';
const CORE = [
  './', './index.html', './journal.html', './photo-journal.html',
  './garden-updates-2026.html', './indoor-plants.html',
  './manifest.webmanifest', './icons/icon-192.png',
  './icons/icon-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request))
  );
});
