import { isObservable } from "./Observable";
import { html } from "./html";
import { css, getStyleClasses } from "./styles/style";
import "./styles/defaultStyles";

export class Component extends HTMLElement {
  #css: { [key: string]: string } = {};
  private createNode(el) {
    if (isObservable(el)) {
      let ph = document.createTextNode("");
      el.subscribe((v) => {
        const n = this.createNode(v);
        ph.replaceWith(n);
        ph = n;
      });
      console.log(ph);
      return ph;
    }
    if (Array.isArray(el)) {
      // @ts-ignore
      return new (customElements.get("ui-map"))().nest(...el);
    }
    if (["number", "string"].includes(typeof el)) {
      const text = new (customElements.get("ui-text"))();
      text.innerText = el;
      return text;
    }
    if (el === null) return document.createTextNode("");
    if (el === undefined) {
      console.error("Element is undefined");
      return document.createTextNode("");
    }
    return el;
  }
  nest(...els) {
    els.forEach((el) => this.appendChild(this.createNode(el)));
    return this;
  }
  html(strings, ...all) {
    this.appendChild(html(strings, ...all).render());
    return this;
  }
  css(...styles) {
    this.#css = { ...this.#css, ...css(...styles) };

    return this;
  }
  attach(node) {
    node.appendChild(this);
    return this;
  }
  connectedCallback() {
    this.classList.add(...getStyleClasses(this.#css));
  }
}
export const getComponent = (path) => {
  const name = path.join("-");
  const El = customElements.get(name);
  if (El) return new El();
  customElements.define(name, class extends Component {});
  return new (customElements.get(name))();
};
