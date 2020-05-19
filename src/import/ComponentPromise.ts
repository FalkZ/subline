import { Component } from "../component/Component";

export class ComponentPromise extends Promise<Component> {}

// attach alias
["nest", "css", "html", "attach"].forEach((name) => {
  Object.defineProperty(ComponentPromise.prototype, name, {
    value: function (...all) {
      return this.then((el: Component) => el[name](...all));
    },
  });
});
