import { Component } from "../component/Component";

export class Input extends Component {
  #input = document.createElement("input");
  constructor({ bind, type }) {
    super();
    if (bind) {
      if (!type) {
        type =
          typeof bind.value === "number"
            ? "number"
            : typeof bind.value === "boolean"
            ? "checkbox"
            : "text";
      }
      bind.subscribe((value) => {
        if (type === "checkbox") this.#input.checked = value;
        else this.#input.value = value;
      });
      this.#input.onchange = ({ target: { value, checked } }: any) => {
        if (type === "number") value = Number(value);
        if (type === "checkbox") value = Boolean(value);
        bind.next(value);
      };
    }
    this.#input.type = type;
    this.appendChild(this.#input);
  }
}
