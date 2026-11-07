// Astral Warp Archive — minimal service worker for PWA installability + light offline.
const CACHE = "awa-v1"
const APP_SHELL = ["/", "/dashboard", "/quick-log", "/icon-512.png", "/apple-icon.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL).catch(() => undefined)),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  // Only handle same-origin GET requests. Never cache API/auth/mutations.
  if (request.method !== "GET") return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/u/")) return

  // Network-first for navigations so logged-in data stays fresh; fall back to cache offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined)
          return res
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/dashboard"))),
    )
    return
  }

  // Cache-first for static assets.
  if (url.pathname.match(/\.(png|svg|jpg|jpeg|webp|ico|woff2?|css|js)$/)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined)
            return res
          }),
      ),
    )
  }
})
