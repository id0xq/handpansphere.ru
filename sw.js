/* Handpan Sphere service worker: keeps the page and its files for offline use.
   The build (vite.config.ts) fills in VERSION and FILES; this file is a template. */
const VERSION = "7660b337fdfa";
const FILES = ["./","assets/encoder.worker-C01vWJKc.js","assets/index-BqKU14QF.css","assets/index-CPUXYlEy.js","assets/onest-cyrillic-ext-wght-normal-DOFToQv1.woff2","assets/onest-cyrillic-wght-normal-DayYxulF.woff2","assets/onest-latin-ext-wght-normal-QAhDxQuo.woff2","assets/onest-latin-wght-normal-Dun_Rd-l.woff2","assets/onest-math-wght-normal-Bl4ZGkZl.woff2","assets/onest-symbols-wght-normal-DxQzqQfC.woff2","assets/onest-vietnamese-wght-normal-BBxOatbv.woff2","icons/app-rounded.svg","icons/app.svg","icons/apple-touch-icon.png","icons/favicon-32.png","icons/icon-192.png","icons/icon-512.png","icons/icon.svg","icons/maskable-512.png","manifest.webmanifest","qr-bandlink.svg"]; // paths relative to the scope; './' is the page itself
const CACHE = 'hs-app-' + VERSION;
const KEEP = ['hs-samples']; // caches that outlive app versions (note samples, stage 3)

// A new version downloads everything first, then takes over; the open page keeps running on what it loaded.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// The page and its files come from the cache: instant start, also offline. A new version is fetched in the
// background (the browser checks sw.js on each visit) and opens next time, so it never cuts into a session.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(caches.match('./', { cacheName: CACHE }).then((hit) => hit || fetch(req)));
    return;
  }
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
