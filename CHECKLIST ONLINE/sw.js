const CACHE_NAME = 'pwa-checklist-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './Estilos/Estilos.css',
  './SetupJs/Firebase.js',
  './Data/minicargador.js',
  './Core/loto-engine.js',
  './Core/Plugins.js',
  './Core/pdf-generator.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalación del Service Worker y Cacheo
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Intercepción de Solicitudes (Estrategia: Cache First, Network Fallback)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});