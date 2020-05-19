import { isObservable } from "../store/Observable";

export const Nest = (Mixin) =>
  class extends Mixin {
    private createNode(el) {
      if (isObservable(el)) {
        let ph = document.createTextNode("");
        el.subscribe((v) => {
          const n = this.createNode(v);
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
  };
