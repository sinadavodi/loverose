// Service Worker برای نوتیفیکیشن‌ها و آفلاین
const CACHE_NAME = 'loverose-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/js/sentences.js',
  '/js/notification.js',
  '/assets/music/romantic.mp3',
  '/sounds/notification.mp3'
];

// نصب Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// فعال‌سازی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

// کنترل fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// دریافت push notification
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'رز عاشقانه';
  const options = {
    body: data.body || 'وقت سر زدن به رزت رسیده!',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'rose-reminder',
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// کلیک روی notification
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
