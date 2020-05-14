import { Import } from "./Import";
import { ui } from "./ui";

const mod = (path = []) => {
  return new Proxy((context) => new Import(path).createElement(context), {
    get: (t, key) => {
      return mod([...path, key]);
    },
  });
};
export const m = mod();

export { ui };
