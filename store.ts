import { fromNext } from "observables-with-streams";
import { set } from "../utiliti/set";
import { get } from "../utiliti/get";
import { Union } from "./compare";
export class Store {
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
