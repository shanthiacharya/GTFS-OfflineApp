// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
importScripts('serviceworker-cache-polyfill.js');

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function(event) {

  if (self.skipWaiting) { self.skipWaiting(); }
  // We pass a promise to event.waitUntil to signal how
  // long install takes, and if it failed
  event.waitUntil(
    // We open a cache…
    caches.open('simple-sw-v2').then(function(cache) {
      // And add resources to it
      return cache.addAll([
        './',
        './data/routes.txt',
        './data/stop_times.txt',
        './js/app.js',
        './js/papaparse.js',
        './js/spin.min.js',
        './js/idb.js',
        './css/styles.css'

        // 'style.css',
        // 'logging.js',
        // 'script.js',
        // Cache resources can be from other origins.
        // This is a no-cors request, meaning it doesn't need
        // CORS headers to be stored in the cache
        // new Request('https://farm6.staticflickr.com/5594/14749918329_888df4f2ef.jpg', {mode: 'no-cors'})
      ]);
    })
  );
});

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function(event) {
  // Calling event.respondWith means we're in charge
  // of providing the response. We pass in a promise
  // that resolves with a response object


  event.respondWith(
    // First we look for something in the caches that
    // matches the request
    caches.match(event.request).then(function(response) {
      // If we get something, we return it, otherwise
      // it's null, and we'll pass the request to
      // fetch, which will use the network.
      return response || fetch(event.request);
    })
  );
});


console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});
self.addEventListener('push', function(event) {
  console.log('Push message received', event);
  // TODO
});
