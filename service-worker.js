
const SHELL_CACHE = "nasa-shell-v1";
const API_CACHE = "nasa-api-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./js/script.js",
    "./js/dateRange.js",
    "./js/pwa.js",
    "./manifest.json",
    "./img/nasa-worm-logo.png",
    "./img/icon-192.png",
    "./img/icon-512.png"
];

// Save app files when service worker installs
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(SHELL_CACHE).then(function(cache) {
            return cache.addAll(APP_FILES);
        })
    );
    self.skipWaiting();
});

// Delete old cache versions
self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names
                    .filter(function(name) {
                        return name !== SHELL_CACHE &&
                               name !== API_CACHE;
                    })
                    .map(function(name) {
                        return caches.delete(name);
                    })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// Intercept network requests
self.addEventListener("fetch", function(event) {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // NASA API: network first, cache second
    if (
        url.hostname === "science.nasa.gov" &&
        url.pathname.includes("/apod-basic")
    ) {
        event.respondWith(
            caches.open(API_CACHE).then(async function(cache) {
                try {
                    const response = await fetch(request);

                    if (response.ok) {
                        await cache.put(request, response.clone());
                    }

                    return response;
                } catch (error) {
                    const saved = await cache.match(request);

                    if (saved) return saved;

                    return new Response(
                        JSON.stringify({
                            error: "No cached NASA data available"
                        }),
                        {
                            status: 503,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );
                }
            })
        );
        return;
    }

    // App shell: cache first
    if (
        url.origin === self.location.origin &&
        APP_FILES.some(function(file) {
            return url.pathname ===
                new URL(file, self.registration.scope).pathname;
        })
    ) {
        event.respondWith(
            caches.match(request).then(function(saved) {
                return saved || fetch(request);
            })
        );
    }
});
