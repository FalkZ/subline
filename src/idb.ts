const request = indexedDB.open("remanent");

request.onupgradeneeded = () => request.result.createObjectStore("data");

const getStore = () =>
  new Promise(
    (resolve) =>
      (request.onsuccess = () => {
        const db = request.result;

        var tx = db.transaction("data", "readwrite");
        var store = tx.objectStore("data");
        resolve(store);

        // @ts-ignore

        //   store.put({ title: "Quarry Memories", author: "Fred", isbn: 123456 }, 1);
        //   store.put({ title: "Water Buffaloes", author: "Fred", isbn: 234567 }, 2);
        //   console.log(
        //     store.put(
        //       { title: "Bedrock Nights", author: "Barney", isbn: 345678 },
        //       3
        //     )
        //   );

        //   tx.oncomplete = function () {
        //     // All requests have succeeded and the transaction has committed.
        //   };

        //   console.log(store.getAll(3));
      })
  );

export const get = (key) =>
  new Promise((resolve) =>
    getStore().then((store: any) => {
      store.get(key).onsuccess = (all) => resolve(all.target.result);
    })
  );

export const set = (key, value) =>
  new Promise((resolve) =>
    getStore().then((store: any) => {
      store.put(value, key).onsuccess = (all) => resolve();
    })
  );

//console.log(set(2, "test").then(() => get(2)));

const remanent = (name) =>
  get(name).then((obj: any = {}) => {
    const prox = (target: any) => {
      if (typeof target !== "object" || target === null) return target;
      return new Proxy(target, {
        get: (target, key) => prox(target[key]),
        set: (target, key, value) => {
          target[key] = value;

          set(name, obj);
          return true;
        },
      });
    };
    return prox(obj);
  });
