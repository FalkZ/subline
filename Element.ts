export class Element extends Promise<Component> {
  nest(...els) {
    return this.then((el: Component) => el.nest(...els));
  }
  css(css) {
    return this.then((el) => el.css(css));
  }
  attach(node) {
    return this.then((el) => el.attach(node));
  }
}
class Component extends HTMLElement {
  nest(...els) {
    els.forEach((el) => this.appendChild(el));
    return this;
  }
  css(css) {
    console.log(css);
    return this;
  }
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