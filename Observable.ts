import {
  subscribe,
  map,
  distinct,
  fromNext,
  scan,
} from "observables-with-streams";
import { get } from "../utiliti/get";
//import { isEqual } from "../utiliti/isEqual";
import isEqual from "lodash.isequal";
import { compare } from "./compare";
import { newDeepObservable } from "./newDeepObservable";

type Mutation = { index: number; value: any };

const merge = scan((last: any[], mut: Mutation) => {
  last[mut.index] = mut.value;

  return last;
}, []);

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
  next(value) {
    if (typeof value === "function") {
      value = value(this.#store.getValue(...this.#path));
    }

    if (this.#store.typeCheck) {
      let typ = this.#store.getType(...this.#path);
      if (!compare(typ, value)) {
        console.error(value, "does not match type:", typ);
        return this;
      }
    }

    this.#store.setValue(value, this.#path);

    return this;
  }

  map(cb) {
    const observable = newDeepObservable({ arr: [] });

    let registered = 0;

    this.attachObserver(this.#path, (arr) => {
      for (let index = registered; index < arr.length; index++) {
        arr._(index).subscribe((value) => {
          const v = cb({ index, value });

          const arr = [...observable.arr];
          arr[index] = v;
          console.log(arr);
          observable._`arr`.next(arr);
        });
        registered = index;
      }
    });
    return observable._`arr`;
  }
}

export const isObservable = (any) => any instanceof Observable;
