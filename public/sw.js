const CACHE = "pixpromax-shell-v4";
const SHELL = [
  "/",
  "/compress-image",
  "/resize-image",
  "/crop-image",
  "/convert-image",
  "/image-to-pdf",
  "/batch-converter",
  "/resize-image-to-kb",
  "/signature-resizer",
  "/passport-photo-maker",
  "/about",
  "/privacy-policy",
  "/terms",
  "/contact",
  "/disclaimer",
  "/faq",
  "/icon.png",
  "/og.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.protocol === "blob:" || url.protocol === "data:") return;
  if (request.destination === "document") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match(request).then((cached) => cached || caches.match("/"))));
    return;
  }
  if (url.pathname.startsWith("/_next/static/") || ["style", "script", "font", "image"].includes(request.destination)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
      return response;
    })));
  }
});
