import { Import } from "./Import";
import { element } from "../elements/element";
import { serviceWorker } from "../installSW";

const mod = (path = []) => {
  return new Proxy((context) => new Import(path).createElement(context), {
    get: (t, key) => {
      return mod([...path, key]);
    },
  });
};
export const m = mod();

export { element as ui, serviceWorker };
