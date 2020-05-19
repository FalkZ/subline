import { html } from "../html";
export const Html = (Mixin) =>
  class extends Mixin {
    html(strings, ...all) {
      this.appendChild(html(strings, ...all).render());
      return this;
    }
  };
