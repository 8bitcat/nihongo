// Service worker — krävs för hemskärms-PWA på iOS. Nätverk först (färska uppdateringar),
// cache som fallback (offline-stöd). Cachen fylls på allteftersom.
const CACHE = 'nihongo-quest-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Push-fallback för klienter som inte hanterar declarative web push (payloaden
// skickas i deklarativt format — iOS 18.4+ visar den utan att väcka denna handler).
self.addEventListener('push', (e) => {
  let data = {};
  try { data = e.data.json(); } catch { /* tom/oparsad payload → standardtext */ }
  const n = data.notification || data;
  e.waitUntil((async () => {
    await self.registration.showNotification(n.title || '⛩️ Nihongo Quest', {
      body: n.body || 'Dags för dagens japanska! 頑張って！',
      data: { url: n.navigate || './' },
    });
    try { if (n.app_badge !== undefined) await self.navigator.setAppBadge(n.app_badge); } catch { /* badge frivillig */ }
  })());
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || './';
  e.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of clientsList) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow(url);
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch {
      const cached = await caches.match(req);
      if (cached) return cached;
      throw new Error('offline och ej cachad: ' + req.url);
    }
  })());
});
