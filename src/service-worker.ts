var CACHE = "default-cache-1";

// On install, cache some resource.
self.addEventListener("install", function (evt) {});

self.addEventListener("fetch", function (evt) {
  console.log("The service worker is serving the asset.");

  evt.respondWith(
    // new Promise((resolve) =>
    fetch(evt.request.url)
      .then((all) => {
        if (all.ok) {
          cache(evt.request.url, all.clone());
          return all; // resolve(all);
        }
        return Promise.reject(all);
      })
      .catch((all) => {
        console.warn("Served from cache:", evt.request.url);
        return caches.open(CACHE).then((cache) =>
          cache.match(evt.request.url).then((resp) => {
            return resp || all;
          })
        );

        //.then((respo) => resolve(respo));
      })
    //  )
  );
});

function cache(url, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(url, response);
  });
}
