import { setDefaultStyles } from "./styles";
import { createObject } from "./createObject";

// all: initial  all: unset;
setDefaultStyles(
  createObject`
    all: initial;
    font-family: sans-serif;
    box-sizing: border-box;
  `
);
