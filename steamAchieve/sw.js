
const RUNTIME_CACHE = 'tutorial-worker-cache-v1';

STATIC_FILES = [
    '/',
    '/steamAchieve/steam.html',
    '/steamAchieve/steam.js',
    '/steamAchieve/manifest.json',
    '/steamAchieve/icons/icon-192x192.png',
    '/steamAchieve/icons/icon-512x512.png',
    '/style.css',
    '/script.js',
    '/steam/achievements'
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

    // Use network first for all other requests
    event.respondWith(networkFirst(req));
});

async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    try {
        // Try network first
        const response = await fetch(request.clone());

        // Update cache if successful
        if (response.ok) {
            await cache.put(request, response.clone());
        }

        return response;
    } catch (err) {
        // Network failed → offline
        const cached = await cache.match(request);
        if (cached) return cached;

        throw err;
    }
}

async function cacheFirst(request) {
    console.log('Cache first for ', request.url);
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    // Cache miss → try network
    const response = await fetch(request);
    if (response.ok) {
        await cache.put(request, response.clone());
    }

    return response;
}