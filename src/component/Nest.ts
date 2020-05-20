import { isObservable } from "../store/Observable";

export const createNode = (el, textClip = true) => {
  if (isObservable(el)) {
    let ph = document.createTextNode("");
    el.subscribe((v) => {
      const n = createNode(v);
      ph.replaceWith(n);
      ph = n;
    });
    return ph;
  }
  if (Array.isArray(el)) {
    // @ts-ignore
    return new (customElements.get("ui-map"))().nest(...el);
  }
  if (["number", "string"].includes(typeof el)) {
    if (textClip) {
      const text = new (customElements.get("ui-text"))();
      text.innerText = el;
      return text;
    } else return document.createTextNode(el);
  }
  if (el === null) return document.createTextNode("");
  if (el === undefined) {
    console.error("Element is undefined");
    return document.createTextNode("");
  }
  return el;
};

export const Nest = (Mixin) =>
  class extends Mixin {
    nest(...els) {
      els.forEach((el) => this.appendChild(createNode(el)));
      return this;
    }
  };
