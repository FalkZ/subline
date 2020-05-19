import { isObservable } from "../Observable";
import { createCSSMap } from "./createCSSMap";

const style = document.createElement("style");
document.head.prepend(style);

//@ts-ignore
window._stylesheet = style.sheet;

let counter = 0;

style.sheet.insertRule(`html {width: 100%; height: 100%}`);
style.sheet.insertRule(`body {margin: 0; min-height: 100%;}`);

const getClassName = (prefix) => {
  ++counter;
  return { className: prefix + counter.toString(36), index: counter };
};

const ruleMap = new Map();

const tryInsertRule = (str, index) => {
  style.sheet.insertRule(str, index);
  if (style.sheet.cssRules[index].cssText.endsWith("{ }")) {
    if (!str.endsWith("null}")) console.error("CSS error, couldn't add:", str);
  }
};

const insertRule = (rule, parents) => {
  const defined = ruleMap.get(rule);
  if (defined) return defined;

  const { className, index } = getClassName("s");

  let postfix = "";
  ruleMap.set(rule, className);

  // Selector / Pseudo Element
  if (rule.startsWith("&")) {
    postfix = /\&([^ ]+)/.exec(rule)[1];
    rule = rule.replace(/\&([^ ]+)/, "");
  }

  let prefix = "";
  // Parent reference
  if (rule.startsWith("cp.")) {
    let [, parent, addition] = /(cp\.[^ :]+)([^ ]*)/.exec(rule);

    parent = parent.replace(".", "-");
    const index = parents.indexOf(parent);
    if (index === -1) {
      console.error("CSS Error parent", parent, "not found.", parents);
    } else {
      prefix = `${parent}${addition}>${"*>".repeat(index)}`;
    }

    rule = rule.replace(/(cp\.[^ :]+)([^ ]*)/, "");
  }

  tryInsertRule(`${prefix}.${className}${postfix} {${rule}}`, index);

  return className;
};

const updateRule = (className, rule, index) => {
  style.sheet.deleteRule(index);
  tryInsertRule(`.${className} {${rule}}`, index);
};

const applyDynamicRule = ({ key, value }) => {
  const { index, className } = getClassName("d");
  style.sheet.insertRule(`.${className} {}`, index);
  value.subscribe((value) => updateRule(className, `${key}: ${value}`, index));

  return className;
};

const applyRule = ({ parents, context }) => ([key, value]) => {
  if (isObservable(value)) {
    return applyDynamicRule({ key, value });
  }
  // else if (isContext(value)) {
  //   value = getContext(context, value);
  //   //console.log(value);
  //   return applyRule({ parents, context })([key, value]);
  // }
  else {
    return insertRule(`${key}: ${value}`, parents);
  }
};

const setDefaultStyles = (...template: CSSTemplate) => () =>
  createCSSMap(template);

const defaultStyles = setDefaultStyles`
    all: initial;
    font-family: sans-serif;
    box-sizing: border-box;
  `;

export const getClassNames = (cssStyleMap, { parents, context }: any = {}) => {
  return defaultStyles()
    .add(cssStyleMap)
    .entries()
    .map(applyRule({ parents: parents || [], context }));
};
