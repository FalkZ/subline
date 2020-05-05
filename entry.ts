import { of, subscribe, map, distinct, last } from "observables-with-streams";
import { get } from "../utiliti/get";
import { isEqual } from "../utiliti/isEqual";
import { isObject } from "../utiliti/isObject";
import { Union } from "./compare";
import { Observable } from "./Observable";
import { Store } from "./Store";
import { m } from "./mod";

const isDefined = (value: any) => value !== undefined;

const getObserver = (obs, path, cb) =>
  obs
    .pipeThrough(map((obj) => get(obj)(...path)))
    .pipeThrough(distinct(isEqual))
    .pipeTo(subscribe(cb));

const store: object = {
  arr: [1, 22, 3, 4],
  test: null,
  test2: "v",
  obj: { arr: [1, 22, 3, 4] },
};

const storeType = {
  arr: [Number, String],
  test: Union(null, Number),
  test2: String,
  obj: {
    arr: [Number, String],
    //@ts-ignore
    [Number]: String,
  },
};

const obsStore = (store: any, storeType: any) => {
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

const v = obsStore(store, storeType);

document.body.appendChild(
  v.obj_createElement(({ context, self }) => {
    self.appendChild(
      context.arr_map(({ self, context, index }) => {
        self.innerHTML = index + ":  " + context;
        return self;
      })
    );
  })
);

console.log(v);

m.test.v("ctx").nest(document.createTextNode("jdkfdkk")).attach(document.body);
