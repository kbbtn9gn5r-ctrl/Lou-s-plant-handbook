const CACHE='lous-garden-welcome-v3';
const ASSETS=['./','./index.html?v=2','./manifest-v2.webmanifest',
'./icons/icon-192-v2.png?v=2','./icons/icon-512-v2.png?v=2','./icons/apple-touch-icon-v2.png?v=2'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match(e.request))));
