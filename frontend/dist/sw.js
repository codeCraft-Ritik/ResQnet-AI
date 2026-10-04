// ResQNet AI — Offline Disaster Field Operations Service Worker
const CACHE_NAME = 'resqnet-cache-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/resqnet-icon.svg'
];

// Install: Cache critical assets for offline field operations
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ResQNet ServiceWorker] Pre-caching offline disaster shell');
      return cache.addAll(OFFLINE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ResQNet ServiceWorker] Purging stale cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for real-time telemetry, cache-fallback when offline
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET requests (e.g. POST report submissions)
  if (request.method !== 'GET') return;

  // For API telemetry requests: try network, fallback to cache
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the successful API response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network failed (e.g. telecom tower down), try cached copy
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return empty fallback JSON
            return new Response(JSON.stringify({ offline: true, detail: "Operating in offline cached mode." }), {
              headers: { "Content-Type": "application/json" }
            });
          });
        })
    );
    return;
  }

  // For navigation and static files: stale-while-revalidate / cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      const networked = fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback
          return cached || caches.match('/');
        });

      return cached || networked;
    })
  );
});
