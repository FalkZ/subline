import { Component } from "../component/Component";

export class Text extends Component {
  constructor() {
    super();
    this.style.display = "block";
  }
  connectedCallback() {
    const styles = getComputedStyle(this);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${styles.fontStyle} ${styles.fontVariant} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    const text = this.innerText;
    this.innerText = "H";
    const rect = this.getBoundingClientRect();
    this.innerText = "";
    let font = ctx.measureText("|H");
    // let correction = (font.actualBoundingBoxAscent / 11 * 4 -
    //   font.actualBoundingBoxDescent) / 2;
    // console.log(correction = 0);
    // this.style.lineHeight = `${(font.actualBoundingBoxAscent)}px`;
    const span = document.createElement("span");
    //span.style.verticalAlign = "top";
    span.style.lineHeight = styles.lineHeight;
    // this.style.verticalAlign = "top";
    this.style.lineHeight = font.actualBoundingBoxAscent + "px";
    //this.style.float = "left";
    // this.style.width = "auto";
    span.style.display = "inline-block";
    span.style.marginTop = `${
      -(rect.height - font.actualBoundingBoxAscent) / 2
    }px`;
    span.style.marginBottom = `${
      -(rect.height - font.actualBoundingBoxAscent) / 2
    }px`;
    span.innerText = text;
    this.appendChild(span);
  }
}
