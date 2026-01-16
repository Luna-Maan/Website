
const RUNTIME_CACHE = 'tutorial-worker-cache-v1';

STATIC_FILES = [
    '/',
    '/steamAchieve/steam.html',
    '/steamAchieve/steam.js',
    '/steamAchieve/PWA.css',
    '/steamAchieve/manifest.json',
    '/steamAchieve/icons/manifest-icon-192.maskable.png',
    '/steamAchieve/icons/manifest-icon-512.maskable.png',
    '/style.css',
    '/script.js',
    '/steam/achievements',
    '/steam/player'
];

self.addEventListener('fetch', event => {
    const req = event.request;

    console.log('Fetching ', req.url);

    const url = new URL(req.url);
    // Use cache first for static files
    if (STATIC_FILES.includes(url.pathname)) {
        event.respondWith(cacheFirst(req));
        return;
    }

    // Don't use cache for other requests
    event.respondWith(
        fetch(req)
    );
});

async function cacheFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);

    console.log('Cache first for ', request.url);

    // Start network request immediately (do not await yet)
    const networkPromise = fetch(request)
        .then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    // If we have cached data, return it immediately
    if (cached) {
        return cached;
    }

    // Otherwise wait for the network
    const networkResponse = await networkPromise;
    if (networkResponse) return networkResponse;

    throw new Error('Network failed and no cache available');
}