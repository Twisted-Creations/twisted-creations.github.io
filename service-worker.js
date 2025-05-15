// Service Worker for Twisted Creations website
const CACHE_VERSION = "v2"; // Increment version to ensure clean update
const CACHE_NAME = "twisted-creations-" + CACHE_VERSION;

// Core assets that should be cached immediately
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/Pages/index.html",
  "/style.css",
  "/modern-styles.css",
  "/transition.css",
  "/splash-styles.css",
  "/splash-transition.css",
  "/script.js",
  "/effects-preference.js",
  "/splash-effects-new.js",
  "/Images/Base-Image.png",
];

// Install event - cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching core assets");
        return cache.addAll(CORE_ASSETS);
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
              // Delete any cache that isn't the current version
              return (
                cacheName.includes("twisted-creations") &&
                cacheName !== CACHE_NAME
              );
            })
            .map((cacheName) => {
              console.log("Deleting outdated cache:", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log("Service Worker activated - claiming clients");
        return self.clients.claim();
      })
  );
});

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "PREFERENCES_UPDATED") {
    // When preferences are updated, clear the cache
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames
              .filter((cacheName) => cacheName.includes("twisted-creations"))
              .map((cacheName) => {
                console.log(
                  "Clearing cache due to preference change:",
                  cacheName
                );
                return caches.delete(cacheName);
              })
          );
        })
        .then(() => {
          // Re-cache core assets after clearing
          return caches.open(CACHE_NAME).then((cache) => {
            console.log("Re-caching core assets after preference change");
            return cache.addAll(CORE_ASSETS);
          });
        })
    );
  }
});

// Helper function to determine if a request should use network-first strategy
function shouldUseNetworkFirst(url) {
  return (
    url.endsWith(".html") ||
    url.endsWith("/") ||
    url.includes("/Pages/") ||
    url.includes("effects-preference")
  );
}

// Fetch event - implement appropriate caching strategies
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip preference-related requests entirely (no caching)
  if (
    url.pathname.includes("effects-preference") ||
    url.pathname.includes("effects-preferences.html")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Choose a caching strategy based on a resource type
  if (shouldUseNetworkFirst(url.pathname)) {
    // Network-first strategy for HTML and dynamic content
    event.respondWith(networkFirstStrategy(event.request));
  } else {
    // Cache-first strategy for static assets
    event.respondWith(cacheFirstStrategy(event.request));
  }
});

// Network-first strategy implementation
function networkFirstStrategy(request) {
  return fetch(request)
    .then((networkResponse) => {
      // Clone the response for caching
      const responseToCache = networkResponse.clone();

      // Only cache successful responses
      if (networkResponse.status === 200) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
      }

      return networkResponse;
    })
    .catch(() => {
      // If the network fails, fall back to cache
      return caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          new Response(
            "Network error occurred. Please try again when you have a connection.",
            {
              status: 408,
              headers: { "Content-Type": "text/plain" },
            }
          )
        );
      });
    });
}

// Cache-first strategy implementation
function cacheFirstStrategy(request) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      // If in cache, return the cached version
      return cachedResponse;
    }

    // If not in cache, fetch from network
    return fetch(request).then((networkResponse) => {
      // Only cache valid responses
      if (
        !networkResponse ||
        networkResponse.status !== 200 ||
        networkResponse.type !== "basic"
      ) {
        return networkResponse;
      }

      // Clone the response for caching
      const responseToCache = networkResponse.clone();

      // Add to cache
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseToCache);
      });

      return networkResponse;
    });
  });
}
