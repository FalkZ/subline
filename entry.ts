import { of, subscribe, map, distinct, last } from "observables-with-streams";
import { get } from "../utiliti/get";
import { isEqual } from "../utiliti/isEqual";
import { isObject } from "../utiliti/isObject";
import { Union } from "./compare";
import { m } from "./mod";
import { newDeepObservable } from "./newDeepObservable";

export const isDefined = (value: any) => value !== undefined;

export const getObserver = (obs, path, cb) =>
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

const v = newDeepObservable(store, storeType);

export { newDeepObservable };

document.body.appendChild(
  v.obj_createElement(({ context, self }) => {
    console.log(
      context.arr_
        .map((context) => {
          // self.innerHTML = context.index + ":  " + context.value;
          return context.index + ":  " + context.value;
        })
        .arr_.subscribe((c) => console.log(c))
    ); //.subscribe((c) => console.log(c));
  })
);

console.log(v);

m.test.v("ctx").nest(document.createTextNode("jdkfdkk")).attach(document.body);
