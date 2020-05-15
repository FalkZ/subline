import { of, subscribe, map, distinct, last } from "observables-with-streams";
import { get } from "../utiliti/get";
import { isEqual } from "../utiliti/isEqual";
import { isObject } from "../utiliti/isObject";

import { Union } from "./src/compare.js";
import { m, ui } from "./src/mod";
import { newDeepObservable } from "./src/newDeepObservable";

export const getObserver = (obs, path, cb) =>
  obs
    .pipeThrough(map((obj) => get(obj)(...path)))
    .pipeThrough(distinct(isEqual))
    .pipeTo(subscribe(cb));

const store: object = {
  arr: [1, 22, 3, 4],
  test: 1,
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

console.log(v);

const i = ui.img;

i.src =
  "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60";

const t = ui.text;

t.style.fontFamily = "'Arial Black'";

const t2 = ui.text;

t2.style.fontFamily = "Algerian";

m.test
  .v({ num: v._`test` }) // .nest(ui.text, t, t2)
  .nest("jdkfdkk", v.arr._`2`, v._`arr`, i).html`
  <svg width="391" height="391" viewBox="-70.5 -70.5 391 391">
  <rect fill="#fff" stroke="#000" x="-70" y="-70" width="390" height="390"/>
  <g opacity="0.8">
    <rect x="25" y="25" width="200" height="200" fill="green" stroke-width="4" stroke="pink" />
    <circle cx="125" cy="125" r="75" fill="orange" />
    <polyline points="50,150 50,200 200,200 200,100" stroke="red" stroke-width="4" fill="none" />
    <line x1="50" y1="50" x2="200" y2="200" stroke="blue" stroke-width="4" />
  </g>
  </svg>
  `.css`
  display: block;
  background: black;
  `.attach(document.body);
