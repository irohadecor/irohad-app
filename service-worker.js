const CACHE_NAME = 'irohad-v3';

const CACHE_FILES = [
  './',
  './index.html',
  './irohad_daily_report.html',
  './irohad_dashboard.html',
  './irohad_ecor_hearing_sheet_v2.html',
  './irohad_setup_guide.html',
  './irohad_estimate.html',
  './irohad_shift.html',
  './irohad_design_manual.html',
  './irohad_rules.html',
  './irohad_planter.html',
  './zaizan_mihoncho.html',
  './irohad_checklist.html',
  './irohad_mvv.html',
  './irohad_notebook.html',
  './irohad_attendance.html',
  './irohad_plan.html',
  './irohad_todo.html',
  './tsubomi_notebook.html',
  './irohad_sales_script.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FILES);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
