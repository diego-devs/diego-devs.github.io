---
layout: compress
permalink: '/unregister.js'
---

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let reg of registrations) {
            reg.unregister();
        }
    });
}

if ('caches' in window) {
    caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
}
