import { CSSMap } from "../styles/CSSMap";
export const CSS = (Mixin) =>
  class extends Mixin {
    #css = new CSSMap();
    css(...styles: CSSTemplate) {
      this.#css.apply(styles);
      return this;
    }
    connectedCallback() {
      this.classList.add(...this.#css.classNames);
    }
  };
