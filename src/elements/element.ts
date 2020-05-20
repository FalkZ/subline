import { Img } from "./Img";
import { Input } from "./Input";
import { Markdown } from "./Markdown";
import { MapWrapper } from "./MapWrapper";
import { Text } from "./Text";

const createElement = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([key, value]: [string, CustomElementConstructor]) => {
        const k = key.toLowerCase();
        customElements.define("element-" + k, value);

        const El = customElements.get("element-" + k);

        return [k, (...props) => new El(...props)];
      }
    )
  );

const element = createElement({
  Img,
  Input,
  MapWrapper,
  Markdown,
  Text,
});

export { element };
