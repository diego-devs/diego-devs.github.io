---
layout: compress
permalink: '/sw.js'
# Kill-switch service worker: PWA is disabled, but devices that installed the
# old cache-first worker keep serving stale pages until it is replaced.
---

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.map(key => caches.delete(key))))
            .then(() => self.registration.unregister())
            .then(() => self.clients.matchAll({ type: 'window' }))
            .then(clients => clients.forEach(client => client.navigate(client.url)))
    );
});
