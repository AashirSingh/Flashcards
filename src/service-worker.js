const CACHE_NAME = 'study-stack-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon/favicon.png',
  '/styles.d2b228d0a7e34779.css',
  '/main.475dbd074bc7b4ec.js',
];

// Install Event: Cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Immediately activate the new service worker
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Claim control to activate immediately
});

// Fetch Event: Handle runtime caching
self.addEventListener('fetch', (event) => {
  // Ignore requests from Chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Ignore non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Serve cached response if available, else fetch from network
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            // Cache successful GET requests from same-origin only
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Optional: Handle errors for offline fallbacks
          // Example: return caches.match('/offline.html');
        });
    })
  );
});