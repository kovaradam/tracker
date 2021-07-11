/* eslint-disable no-restricted-globals */

const cacheName = 'tracker-cache';

const appShellFiles = [
  'index.html',
  'src/create-leaflet-stylesheet.js',
  'assets/icons/icon-32.png',
  'assets/icons/icon-64.png',
  'assets/icons/icon-96.png',
  'assets/icons/icon-128.png',
  'assets/icons/icon-168.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-256.png',
  'assets/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(appShellFiles);
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const cacheResponse = await caches.match(event.request);
      if (cacheResponse) {
        return cacheResponse;
      }
      if (!event.request.url.includes('http')) {
        return;
      }
      const response = await fetch(event.request);
      const cache = await caches.open(cacheName);
      cache.put(event.request, response.clone());
      return response;
    })(),
  );
});
