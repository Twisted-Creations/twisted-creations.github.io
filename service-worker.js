// Service Worker for Twisted Creations website
const CACHE_NAME = "twisted-creations-v1";
const ASSETS = [
    "/",
    "/index.html",
    "/Pages/index.html",
    "/Pages/about-us.html",
    "/Pages/our-team.html",
    "/Pages/game-info.html",
    "/Pages/Devlog.html",
    "/style.css",
    "/modern-styles.css",
    "/transition.css",
    "/script.js",
    "/effects-preference.js",
    "/Images/Base-Image.png",
];

// Install event - cache assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return a cached response if found
            if (response) {
                return response;
            }

            // Clone the request
            const fetchRequest = event.request.clone();

            // Make a network request and cache the response
            return fetch(fetchRequest).then((response) => {
                // Check if valid response
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                // Open cache and store response
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});
