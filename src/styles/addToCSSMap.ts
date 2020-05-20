import { isObservable } from "../store/Observable";
import { CSSMap } from "./CSSMap";

export const addToCSSMap = (
  template: CSSTemplate,
  map: CSSMap = new CSSMap()
) => {
  let last;
  const [strings, ...objects] = template;

  const ret = [...strings, ""]
    .map((str, index) => {
      let s: any = str.trim().split(";");

      if (last) {
        const prefix = last[1];
        const postfix = s.shift() || "";

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

      if (last) s.unshift(last);
      if (index !== strings.length - 1) {
        last = s.pop();
      } else {
        s.push(last);
        last = null;
      }

      return s;
    })
    .flat()
    .filter(Boolean);

  return map.add(ret);
};
