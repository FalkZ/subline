import { html } from "../html";
export const Html = (Mixin) =>
  class extends Mixin {
    html(strings, ...all) {
      const h = html(strings, ...all);

      if (Array.isArray(h)) h.forEach((h) => this.appendChild(h.render()));
      else this.appendChild(h.render());
      return this;
    }
  };
