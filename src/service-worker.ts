import { get } from "./idb";

const getCache = () => caches.open("auto-cache");

self.addEventListener("fetch", function (evt: any) {
  evt.respondWith(
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
        return getCache().then((cache) =>
          cache.match(evt.request.url).then((resp) => {
            return resp || all;
          })
        );
      })
  );
});

function cache(url, response) {
  return getCache().then(function (cache) {
    return cache.put(url, response);
  });
}
