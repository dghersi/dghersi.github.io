// sw.js - Service Worker Offline-First PWA
const CACHE_NAME = 'pwa-checklist-v2';
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
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});