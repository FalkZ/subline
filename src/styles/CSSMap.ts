import { Observable } from "../Observable";
import { getClassNames } from "./styles";
import { createCSSMap } from "./createCSSMap";

export class CSSMap extends Map<String, String | Observable> {
  add(css: any) {
    (css instanceof CSSMap ? css.entries() : css).forEach(([key, value]) =>
      this.set(key, value)
    );
    return this;
  }

  entries(): any {
    return [...super.entries()];
  }

  apply(template: CSSTemplate) {
    createCSSMap(template, this);

    return this;
  }

  get classNames() {
    return getClassNames(this);
  }
}
