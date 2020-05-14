import { isObservable } from "../Observable";

//import { isContext } from "../utilities/context";

import expand from "css-shorthand-expand";
// import { getStyleClasses } from "./style";

export const cssKey = Symbol("css");

export const css = (strings, ...contents) => {
  if (!Array.isArray(strings) && typeof strings === "object") return strings;
  let dynamic;

  const rules = {};
  strings
    .map((s, index) => {
      const r = s
        .split(";")
        //.filter((f) => f.trim())
        .map((v) => v.split(": "));

      const last = dynamic;
      if (contents[index] !== undefined) {
        const [key, prefix] = r.pop();
        dynamic = { key, prefix, value: contents[index] };
      }

      if (index !== 0) {
        const postfix = r[0] || "";
        last.postfix = postfix;

        if (isObservable(last.value)) {
          r[0] = [
            last.key,
            last.value.pipe((val) => last.prefix + val + last.postfix),
          ];
        }
        // else if (isContext(last.value)) {
        //   r[0] = [
        //     last.key,
        //     last.value.pipe((val) => last.prefix + val + last.postfix),
        //   ];
        // }
        else {
          r[0] = [last.key, last.prefix + last.value + last.postfix];
        }
      }

      return r;
    })
    .flat()
    .forEach(([key, val]) => {
      if (typeof val === "string") val = val.trim();
      key = key.trim();
      if (key === "line-height") key = "--line-height";
      if (key.startsWith("*")) key = key.substring(1);

      let longhand;
      try {
        longhand = expand(key, val);
      } catch {}

      if (longhand) {
        Object.entries(longhand).forEach(([key, val]) => (rules[key] = val));
      } else if (key.trim()) {
        rules[key] = val;
      }
    });

  return rules;
};
