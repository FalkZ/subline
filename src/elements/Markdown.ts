import { Component } from "../component/Component";

export class Markdown extends Component {
  constructor(strings, ...obj: any) {
    super();
    const nr = "66f6181bcb4cff4cd38fbc804a036db6";
    const hash = `{{${nr}}}`;
    import(
      // @ts-ignore
      "https://unpkg.com/marked@1.1.0/lib/marked.esm.js"
    )
      .then((mod: any) => mod.default(strings.join(hash)))
      .then((strings) => {
        strings = `<span>${strings}</span>`
          .replace(new RegExp(`["-](?:${nr})`, "g"), "")
          .split(new RegExp(`(?:%7B%7B${nr}%7D%7D)|(?:${hash})`));
        // @ts-ignore
        this.html(strings, ...obj);
      });
  }
}
