import { isObservable } from "../Observable";
import { newDeepObservable } from "../newDeepObservable";
import { CSSMap } from "./CSSMap";

export const createObject = (
  strings: TemplateStringsArray,
  ...objects: any[]
) => {
  let last;
  const ret = [...strings, ""]
    .map((str, index) => {
      let s: any = str.trim().split(";");

      if (last) {
        const prefix = last[1];
        const postfix = s.shift() || "";

        console.log(objects[index - 1], isObservable(objects[index - 1]));
        if (isObservable(objects[index - 1])) {
          last[1] = objects[index - 1].pipe((val) => prefix + val + postfix);
        } else {
          last[1] = prefix + (objects[index - 1] || "") + postfix;
        }
      }

      s = s
        .map((str) => str.trim())
        .filter(Boolean)
        .map((str) => str.split(":").map((str) => str.trim()));

      console.log({ last });
      if (last) s.unshift(last);
      if (index !== strings.length - 1) {
        last = s.pop();
      } else {
        s.push(last);
        last = null;
      }

      console.log({ s });
      return s;
    })
    .flat()
    .filter(Boolean);
  console.log(ret);

  return new CSSMap(ret);
};
