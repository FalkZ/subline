import { Observable } from "../store/Observable";
import { getClassNames } from "./convertToStyles";
import { addToCSSMap } from "./addToCSSMap";

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
    addToCSSMap(template, this);

    return this;
  }

  get classNames() {
    return getClassNames(this);
  }
}
