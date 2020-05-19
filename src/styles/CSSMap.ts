import { Observable } from "../Observable";
import { getClassNames } from "./styles";

export class CSSMap extends Map<String, String | Observable> {
  add(css: CSSMap) {
    [...css.entries()].forEach(([key, value]) => this.set(key, value));
    return this;
  }

  entries(): any {
    return [...super.entries()];
  }

  get classNames() {
    return getClassNames(this);
  }
}
