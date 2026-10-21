/* SeoaIA: modo híbrido con caché de la interfaz y de los PDF que el usuario abre. */
const CACHE_NAME = 'seoaia-v16-offline';
const CORE_ASSETS = [
  './', 'index.html', 'padres.html', 'mercado-laboral.html', 'balotario.html',
  'css/style.css', 'js/config.js', 'js/carreras.js', 'js/conocimiento.js',
  'js/personajes.js', 'js/ia.js', 'js/script.js', 'js/silabos-offline.json',
  'manifest.webmanifest', 'img/icon.svg', 'voz/voz-referencia.mp3'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(CORE_ASSETS.map(async asset => {
      try { const response = await fetch(asset, { cache: 'reload' }); if (response.ok) await cache.put(asset, response); } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('seoaia-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.includes('/api/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        // Cachea la interfaz, el manifiesto y los PDF visitados, no todos los PDF de golpe.
        if (request.mode === 'navigate' || CORE_ASSETS.some(a => url.pathname.endsWith(a.replace(/^\.\//, ''))) || url.pathname.toLowerCase().endsWith('.pdf')) {
          await cache.put(request, response.clone());
        }
      }
      return response;
    } catch (_) {
      const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
      if (cached) return cached;
      if (request.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
      return Response.error();
    }
  })());
});
