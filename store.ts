import {
  of,
  subscribe,
  fromNext,
  map,
  distinct,
  last,
} from "observables-with-streams";
import { set } from "../utiliti/set";
import { get } from "../utiliti/get";
import { isEqual } from "../utiliti/isEqual";
import { isObject } from "../utiliti/isObject";
import { compare, Union } from "./compare";

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

class Observable {
  #store;
  #path;

  constructor({ store, path }) {
    this.#store = store;
    this.#path = path;
  }

  private attachObserver(path, cb) {
    return this.#store.store
      .pipeThrough(map((obj) => get(obj)(...path)))
      .pipeThrough(distinct(isEqual))
      .pipeTo(subscribe(cb));
  }

  subscribe(cb) {
    this.attachObserver(this.#path, cb);
    return this;
  }

  next(cb) {
    const value = this.#store.getValue(...this.#path);
    if (typeof cb === "function") {
      cb = cb(value);
    }
    let typ = this.#store.getType(...this.#path);

    if (compare(typ, cb)) {
      this.#store.setValue(cb, this.#path);
    } else {
      console.error(cb, "does not match type:", typ);
    }
    return this;
  }

  map(cb) {
    let registered = 0;
    this.attachObserver(this.#path, (arr) => {
      //if (isObject(arr)) arr = Object.entries(arr);
      for (let index = registered; index < arr.length; index++) {
        arr[index + "_"].subscribe((value) => {
          cb({ index, value });
        });

        registered = index;
      }
    });

    return this;
  }
}

class Store {
  next: Function;
  prox: Function;
  #store: any;
  #source: any;
  #types: any;

  constructor({ store, storeType }) {
    this.#store = fromNext((fn) => {
      this.next = fn;
    });
    this.#source = store;
    this.#types = storeType;
  }

  get store() {
    const [o1, o2] = this.#store.tee();
    this.#store = o1;
    return o2;
  }
  getValue(...path) {
    return get(this.#source)(...path);
  }

  setValue(value, path) {
    set(this.#source)(...path)(value);
    this.next(this.prox(this.#source));
  }
  getType(...path) {
    const parent = get(this.#types)(...path.slice(0, -1));
    if (Array.isArray(parent)) {
      return Union(...parent);
    } else {
      return get(this.#types)(...path);
    }
  }
}

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

class Element extends Promise<Component> {
  nest(...els) {
    return this.then((el: Component) => el.nest(...els));
  }
  css(css) {
    return this.then((el) => el.css(css));
  }
  attach(node) {
    return this.then((el) => el.attach(node));
  }
}

const mod = (path = []) => {
  return new Proxy((context) => new Import(path).createElement(context), {
    get: (t, key, value) => {
      return mod([...path, key]);
    },
  });
};

class Component extends HTMLElement {
  nest(...els) {
    els.forEach((el) => this.appendChild(el));

    return this;
  }

  css(css) {
    console.log(css);

    return this;
  }
  attach(node) {
    node.appendChild(this);

    return this;
  }
}

const getComponent = (path) => {
  const name = path.join("-");

  const El = customElements.get(name);

  if (El) return new El();
  customElements.define(name, class extends Component {});

  return new (customElements.get(name))();
};

// new Element<Component>((resolve) =>
//   new Promise((v) => {
//     v();
//   }).then(resolve)
// ).nest();

class Import {
  static base = "http://127.0.0.1:5500";
  #path = [];
  #key: string;

  constructor(path) {
    this.#key = path.pop();
    this.#path = path;
  }

  createElement(context) {
    return new Element((resolve, reject) => {
      import([Import.base, ...this.#path].join("/") + ".js").then((mod) => {
        if (!mod[this.#key]) reject("No module found");

        const self = getComponent([...this.#path, this.#key]);

        mod[this.#key]({
          context,
          self,
        });

        resolve(self);
      });
    });
  }
}

const m = mod();

m.test.v("ctx").nest(document.createTextNode("jdkfdkk")).attach(document.body);
