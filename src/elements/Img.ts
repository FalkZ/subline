import { Component } from "../component/Component";

export class Img extends Component {
  #image = new Image();
  #src: string;
  constructor({ src, prefetch, width, height }: any = {}) {
    super();
    if (prefetch === undefined) prefetch = true;
    this.style.display = "block";
    this.style.width = width;
    this.style.height = height;
    this.#image.style.width = "100%";
    this.#image.style.maxHeight = "100%";
    if (prefetch) {
      this.#image.src = src;
      this.classList.add("loading");
    } else {
      this.#src = src;
    }
  }
  connectedCallback() {
    if (this.#src) {
      this.#image.src = this.#src;
      this.classList.add("loading");
    }
    this.#image.onload = () => {
      this.appendChild(this.#image);
      this.classList.remove("loading");
    };
  }
}
