import htm from "htm";

function h(type, props, ...children): any {
  return {
    type,
    props,
    children,
    render: function ({ ns }: any = {}) {
      if (this.type === "svg") ns = "http://www.w3.org/2000/svg";
      const el = document.createElementNS(ns, this.type);

      Object.entries(this.props).forEach(([key, value]: any[]) =>
        el.setAttribute(key, value)
      );

      this.children.forEach((child) => {
        if (["string", "number"].includes(typeof child))
          el.appendChild(document.createTextNode(child));
        else if (child === null) {
        } else if (typeof child === "object")
          el.appendChild(child.render({ ns }));
      });

      return el;
    },
  };
}

export const html = htm.bind(h);
