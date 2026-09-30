/* Service Worker — Panel Kontrol Energi (Buona Cita)
   Tujuan: syarat PWA (bisa diinstal) + cangkang aplikasi tetap terbuka saat sinyal jelek.
   DATA panel (Firebase Realtime Database / Auth) TIDAK PERNAH di-cache di sini —
   angka di dashboard selalu langsung dari server.
   Naikkan CACHE_VERSION setiap kali Anda mengganti file statis (ikon/manifest). */
const CACHE_VERSION = 'bc-panel-v1';
const SHELL = ['./', './index.html', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Halaman (index.html): jaringan dulu supaya update langsung terbaca; cache hanya cadangan offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => { caches.open(CACHE_VERSION).then(c => c.put('./index.html', res.clone())); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Modul Firebase SDK (versi dipatok di URL, tidak berubah) -> cache-first agar app bisa terbuka offline.
  if (url.origin === 'https://www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) caches.open(CACHE_VERSION).then(c => c.put(req, res.clone()));
        return res;
      }))
    );
    return;
  }

  // File statis satu domain (ikon, manifest): stale-while-revalidate.
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(hit => {
        const net = fetch(req).then(res => {
          if (res.ok) caches.open(CACHE_VERSION).then(c => c.put(req, res.clone()));
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
  }
  // Lainnya (Firebase database/auth, dll): tidak disentuh sama sekali.
});
