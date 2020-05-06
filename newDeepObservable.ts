import { Observable } from "./Observable";
import { Store } from "./Store";
import { isDefined, getObserver } from "./entry";

const observableKeys = Object.getOwnPropertyNames(
  Object.getPrototypeOf(Observable)
);

console.log(observableKeys);

export const newDeepObservable = (store: any, storeType?: any) => {
  const st = new Store({ store, storeType });
  const prox = (value: any, path: string[] = []) => {
    if (typeof value !== "object" || value === null) return value;
    return new Proxy(value, {
      get: (target: any, key: string): ProxyConstructor | Function | any => {
        const r = target[key];
        key = String(key);
        if (isDefined(r)) {
          return prox(r, [...path, key]);
        }

        if (key.endsWith("_")) {
          key = key.slice(0, -1);
          const r = target[key];
          if (isDefined(r)) {
            return new Observable({ store: st, path: [...path, key] });
          }
        }

        // const obs = new Observable({ store: st, path: [...path] });

        // if (isDefined(obs[key])) return (...all) => obs[key](...all);

        if (key.endsWith && key.endsWith("_createElement")) {
          key = key.slice(0, -14);
          const r = target[key];
          if (isDefined(r)) {
            return (cb) => {
              const self = document.createElement("a");
              getObserver(st.store, [...path, key], (context) =>
                cb({ context, self })
              );
              return self;
            };
          }
        }
        if (key.endsWith("_map")) {
          key = key.slice(0, -4);
          const r = target[key];
          if (isDefined(r)) {
            return (cb) => {
              const wrap = document.createElement("b");
              const arrObs = [];
              getObserver(st.store, [...path, key], (arr) => {
                let lastIndex;
                arr.forEach((el, index) => {
                  lastIndex = index;
                  if (!wrap.children[index]) {
                    arrObs[index] =
                      arrObs[index] || document.createElement("div");
                    const self = arrObs[index];
                    wrap.appendChild(self);
                    arr[index + "_"].subscribe((context) => {
                      if (value !== undefined) {
                        cb({ context, index, self });
                      }
                    });
                  }
                });
                [...wrap.children].forEach((el, i) => {
                  if (i > lastIndex) el.remove();
                });
              });
              return wrap;
            };
          }
        }
      },
    });
  };
  st.prox = prox;
  st.next(prox(store));
  return prox(store);
};
