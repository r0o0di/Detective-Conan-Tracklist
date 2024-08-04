// service-worker.js

const AUDIO_CACHE_NAME = 'audios';
const IMAGE_CACHE_NAME = 'images';

self.addEventListener('install', event => {
  // Pre-cache some images if needed
  event.waitUntil(
    caches.open(IMAGE_CACHE_NAME).then(cache => {
      return cache.addAll([
        // Add initial images to cache here if needed
        '../00images/anime.jpg',
        '../00images/download-active.png',
        '../00images/download.png',
        '../00images/endings.jpg',
        '../00images/heart-active.png',
        '../00images/heart.png',
        '../00images/home-active.png',
        '../00images/home.png',
        '../00images/icon.png',
        '../00images/openings.jpg',
        '../00images/OST1.png',
        '../00images/ova.jpg',
        '../00images/pause.png',
        '../00images/play.png',
        '../00images/short_stories.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('.mp3') || event.request.url.includes('.wav')) {
    // Handle audio cache
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          return caches.open(AUDIO_CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else if (event.request.url.includes('.jpg') || event.request.url.includes('.jpeg') || event.request.url.includes('.png') || event.request.url.includes('.svg')) {
    // Handle image cache
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          return caches.open(IMAGE_CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Fallback to the network for other types of requests
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [AUDIO_CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
