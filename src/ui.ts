import { Component } from "./component/Component";
import { Observable } from "./store/Observable";

const ui: any = {};

const define = (name, Cp) => {
  customElements.define("ui-" + name, Cp);

  const El = customElements.get("ui-" + name);

  Object.defineProperty(ui, name, {
    enumerable: true,
    configurable: false,
    value: (...props) => new El(...props),
  });
};

define("map", class extends Component {
  constructor() {
    super();
    this.style.display = "contents";
  }
});

define("text", class extends Component {
  constructor() {
    super();
    this.style.display = "block";
  }
  connectedCallback() {
    const styles = getComputedStyle(this);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = `${styles.fontStyle} ${styles.fontVariant} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;

    const text = this.innerText;

    this.innerText = "H";

    const rect = this.getBoundingClientRect();

    this.innerText = "";

    let font = ctx.measureText("|H");

    // let correction = (font.actualBoundingBoxAscent / 11 * 4 -
    //   font.actualBoundingBoxDescent) / 2;

    // console.log(correction = 0);

    // this.style.lineHeight = `${(font.actualBoundingBoxAscent)}px`;

    const span = document.createElement("span");

    //span.style.verticalAlign = "top";
    span.style.lineHeight = styles.lineHeight;

    // this.style.verticalAlign = "top";
    this.style.lineHeight = font.actualBoundingBoxAscent + "px";
    //this.style.float = "left";
    // this.style.width = "auto";

    span.style.display = "inline-block";
    span.style.marginTop = `${
      -(rect.height - font.actualBoundingBoxAscent) / 2
    }px`;

    span.style.marginBottom = `${
      -(rect.height - font.actualBoundingBoxAscent) / 2
    }px`;

    span.innerText = text;

    this.appendChild(span);
  }
});

define("input", class extends Component {
  #input = document.createElement("input");
  constructor({ bind, type }) {
    super();
    if (bind) {
      if (!type) {
        type =
          typeof bind.value === "number"
            ? "number"
            : typeof bind.value === "boolean"
            ? "checkbox"
            : "text";
      }

      bind.subscribe((value) => {
        if (type === "checkbox") this.#input.checked = value;
        else this.#input.value = value;
      });
      this.#input.onchange = ({ target: { value, checked } }: any) => {
        if (type === "number") value = Number(value);
        if (type === "checkbox") value = Boolean(value);
        bind.next(value);
      };
    }
    this.#input.type = type;

    this.appendChild(this.#input);
  }
});

define("markdown", class extends Component {
  constructor(strings, ...obj: any) {
    super();
    const hash = "{{}}";

    console.log(
      import(
        // @ts-ignore
        "https://unpkg.com/marked@1.1.0/lib/marked.esm.js"
      )
        .then((mod: any) => mod.default(strings.join(hash)))

        .then((strings) => {
          strings = `<span>${strings}</span>`;
          console.log(strings.split(/(?:%7B%7B%7D%7D)|(?:{{}})/));
          // @ts-ignore
          this.html(strings.split(/(?:%7B%7B%7D%7D)|(?:{{}})/), ...obj);
        })
    );
  }
});

https: define("img", class extends Component {
  #image = new Image();
  #src: string;
  constructor({ src, prefetch, width, height }: any = {}) {
    super();

    if (prefetch === undefined) prefetch = true;

    this.style.display = "block";
    this.style.width = width;
    this.style.height = height;

    this.#image.style.width = "100%";
    this.#image.style.maxHeight = "100%";
    if (prefetch) {
      this.#image.src = src;
      this.classList.add("loading");
    } else {
      this.#src = src;
    }
  }

  connectedCallback() {
    if (this.#src) {
      this.#image.src = this.#src;
      this.classList.add("loading");
    }
    this.#image.onload = () => {
      this.appendChild(this.#image);
      this.classList.remove("loading");
    };
  }
});

export { ui };
