import {
  store,
  m,
  element,
  serviceWorker,
  types,
  cmyk,
} from "../dist/subline.js";

const { Union } = types;

const v = store({
  arr: [1, 22, 3, 4],
  test: 1,
  test2: "v",
  test3: true,
  obj: { arr: [1, 22, 3, 4] },
}).types({
  arr: [Number, String],
  test: Union(null, Number),
  test2: String,
  test3: Boolean,
  obj: {
    arr: [Number, String],
    [Number]: String,
  },
});

console.log(v);

const i = element.img({
  src:
    "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
  width: "50%",
});

m.demo.test.v({ num: v._`test` }).nest(
  element.markdown`
  # test ${v._`test`}

  [${"test"}](${"va"})
      `,
  element.input({ bind: v._`test3` }),
  element.input({ bind: v._`test2` }),
  element.input({ bind: v._`test` }).css`display: block;`,
  "jdkiiiiiiiiiiii sa dsa dsa dsa f sfds dsfffffffffghhhhhhhhhh ds pdsa fda fda fdfff sfd dsfda dsff wfdkk",
  v.arr._`2`,
  v._`arr`,
  i
).html`
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
  background: ${v._`test`.pipe((v) =>
    v === 1 ? "green" : cmyk(1, 0, 0.7, 0)
  )};
  font-size: 30px;
  font: 30px;
  `.attach(document.body);

serviceWorker({ path: "/demo/service-worker.js" });
