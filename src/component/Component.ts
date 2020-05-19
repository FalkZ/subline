import { CSS } from "./CSS";
import { Html } from "./Html";
import { Nest } from "./Nest";

import { compose } from "./compose";

export class Component extends compose(HTMLElement, CSS, Nest, Html) {
  attach(node) {
    node.appendChild(this);
    return this;
  }
}

export const getComponent = (path) => {
  const name = path.join("-");
  const El = customElements.get(name);
  if (El) return new El();
  customElements.define(name, class extends Component {});
  return new (customElements.get(name))();
};
