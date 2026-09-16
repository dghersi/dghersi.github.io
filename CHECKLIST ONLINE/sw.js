// sw.js - Service Worker Offline-First PWA
// IMPORTANTE: sube este número cada vez que cambies cualquier archivo
// listado en ASSETS_TO_CACHE. Si no lo subes, los usuarios seguirán
// viendo la versión vieja cacheada aunque reemplaces los archivos.
const CACHE_NAME = 'pwa-checklist-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './Estilos/Estilos.css',
  './SetupJs/Firebase.js',
  './Data/Universal/universal.js',
  './Data/Minicargador/minicargador.js',
  './Core/loto-engine.js',
  './Core/Plugins.js',
  './Core/pdf-generator.js'
];

self.addEventListener('install', (e) => {
  // Activa el nuevo SW de inmediato, sin esperar a que se cierren las pestañas viejas
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (e) => {
  // Borra cachés de versiones anteriores (ej. 'pwa-checklist-v2')
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // Toma control de las pestañas abiertas ya mismo
  );
});

self.addEventListener('fetch', (e) => {
  // Network-first: intenta traer la versión más reciente de la red;
  // si no hay red (offline), recién ahí usa el caché como respaldo.
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return networkResponse;
      })
      .catch(() => caches.match(e.request))
  );
});