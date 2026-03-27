const CACHE_NAME = 'aralaganwila-offers-v1';
const ASSETS = [
  '/Aralaganwila-offer/',
  '/Aralaganwila-offer/customer.html',
  '/Aralaganwila-offer/shop.html',
  '/Aralaganwila-offer/admin.html',
  '/Aralaganwila-offer/icon-192.png',
  '/Aralaganwila-offer/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.url.includes('firebase') || e.request.url.includes('firestore') || e.request.url.includes('googleapis')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        if(res && res.status===200 && res.type==='basic'){
          caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
