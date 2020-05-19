import { Component } from "./Component";

export class Element extends Promise<Component> {
  nest(...els) {
    return this.then((el: Component) => el.nest(...els));
  }
  css(...css: [TemplateStringsArray, ...any[]]) {
    return this.then((el) => el.css(...css));
  }
  html(strings, ...all) {
    return this.then((el) => el.html(strings, ...all));
  }
  attach(node) {
    return this.then((el) => el.attach(node));
  }
}
