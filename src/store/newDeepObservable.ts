import { Observable } from "./Observable";
import { Store } from "./Store";
import { isDefined } from "../../../utiliti/isDefined";

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

        if (key === "_") {
          return (arg, ...obj) => {
            let temp = arg;
            if (Array.isArray(arg)) {
              temp = arg.reduce(
                (last, next, index) => last + next + (obj[index] || ""),
                ""
              );
            }

            return new Observable({ store: st, path: [...path, temp] });
          };
        }
      },
    });
  };
  st.prox = prox;
  st.next(prox(store));
  return prox(store);
};

export const store = (store: any) => ({
  types: (storeType?: any) => newDeepObservable(store, storeType),
});
