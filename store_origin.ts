import {
  of,
  subscribe,
  fromNext,
  map,
  distinct,
  last
} from "observables-with-streams";
import { set } from "../utiliti/set";
import { get } from "../utiliti/get";
import { isEqual } from "../utiliti/isEqual";
import { compare, Union } from "./compare";

const isDefined = (value: any) => value !== undefined;

const store: object = {
  test: null,
  test2: "v",
  obj: { arr: [1, 22, 3, 4] }
};

const storeType = {
  test: Union(null, Number),
  test2: String,
  obj: { arr: [Number, String] }
};

const getObserver = (obs, path, cb) =>
  obs
    .pipeThrough(
      map((obj) => get(obj)(...path))
    ).pipeThrough(
      distinct(isEqual)
    )
    .pipeTo(subscribe(cb));

const obsStore = (store: any, storeType: any) => {
  let next;
  let s = fromNext((fn) => (next = fn));

  const getStore = () => {
    const [o1, o2] = s.tee();
    s = o1;
    return o2;
  };
  // s.pipeTo(subscribe(console.log));

  //next(store);

  const prox = (value: any, path: string[] = []) => {
    if (typeof value !== "object" || value === null) return value;
    return new Proxy(value, {
      get: (target: any, key: string): ProxyConstructor | Function => {
        const r = target[key];

        if (isDefined(r)) {
          return prox(r, [...path, key]);
        }

        if (key.endsWith("$")) {
          key = key.slice(0, -1);
          const r = target[key];
          if (isDefined(r)) {
            return (cb) => {
              if (typeof cb === "function") {
                cb = cb(r);
              }
              let typ;
              if (Array.isArray(target)) {
                typ = Union(...get(storeType)(...[...path]));
              } else {
                typ = get(storeType)(...[...path, key]);
              }
              //  console.log(typ, storeType, [...path, key]);
              if (compare(typ, cb)) {
                target[key] = cb;
                next(prox(store));
              } else {
                console.error(cb, "does not match type:", typ);
              }
            };
          }
        }

        if (key.endsWith("_")) {
          key = key.slice(0, -1);
          const r = target[key];
          if (isDefined(r)) {
            return (cb) => {
              getObserver(getStore(), [...path, key], cb);
            };
          }
        }

        if (key.endsWith("_map")) {
          key = key.slice(0, -4);
          const r = target[key];
          if (isDefined(r)) {
            return (cb) => {
              const arrObs = [];
              getObserver(
                getStore(),
                [...path, key],
                (arr) => {
                  let lastIndex;
                  arr.forEach((el, index) => {
                    lastIndex = index;
                    if (!arrObs[index]) {
                      arr[index + "_"]((value) => {
                        if (value !== undefined) {
                          cb(value, index);
                        }
                      });

                      arrObs[index] = 1;
                    }
                  });
                }
              );
            };
          }
        }

        if (["then", "toJSON"].includes(key)) return;
        console.error("no value with the key", key, "in", target);
      }
    });
  };

  next(prox(store));

  return prox(store);
};

console.log(obsStore(store, storeType));
