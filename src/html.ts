import htm from "htm";
import { isObservable } from "./store/Observable";
import { createNode } from "./component/Nest";

function h(type, props, ...children): any {
  return {
    type,
    props,
    children,
    render: function ({ ns }: any = {}) {
      if (this.type === "svg") ns = "http://www.w3.org/2000/svg";
      const el = document.createElementNS(ns, this.type);

      if (this.props)
        Object.entries(this.props).forEach(([key, value]: any[]) => {
          if (isObservable(value)) {
            value.subscribe((value) => el.setAttribute(key, value));
          } else el.setAttribute(key, value);
        });

      this.children.forEach((child) => {
        if (["string", "number"].includes(typeof child))
          el.appendChild(document.createTextNode(child));
        else if (isObservable(child)) {
          let ph = document.createTextNode("");
          el.appendChild(ph);
          child.subscribe((value) => {
            const n = createNode(value, false);
            ph.replaceWith(n);
            ph = n;
          });
        } else if (child === null) {
        } else if (typeof child === "object")
          el.appendChild(child.render({ ns }));
      });

      return el;
    },
  };
}

export const html = (...all: any) => {
  //@ts-ignore
  let ret = htm.bind(h)(...all);
  if (Array.isArray(ret)) ret = h(ret.shift(), null, ...ret);
  return ret;
};
