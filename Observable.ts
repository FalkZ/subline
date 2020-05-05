import { subscribe, map, distinct } from "observables-with-streams";
import { get } from "../utiliti/get";
import { isEqual } from "../utiliti/isEqual";
import { compare } from "./compare";
export class Observable {
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
