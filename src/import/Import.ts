import { ComponentPromise } from "./ComponentPromise";
import { getComponent } from "../component/Component";
// new Element<Component>((resolve) =>
//   new Promise((v) => {
//     v();
//   }).then(resolve)
// ).nest();
export class Import {
  static base = "http://127.0.0.1:5500";
  #path = [];
  #key: string;
  constructor(path) {
    this.#key = path.pop();
    this.#path = path;
  }
  createElement(context) {
    return new ComponentPromise((resolve, reject) => {
      import([Import.base, ...this.#path].join("/") + ".js").then((mod) => {
        if (!mod[this.#key]) reject("No module found");
        const self = getComponent([...this.#path, this.#key]);
        mod[this.#key]({
          context,
          self,
        });
        resolve(self);
      });
    });
  }
}
