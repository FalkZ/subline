import { ui } from "./ui";
import { serviceWorker } from "./installSW";
import { m } from "./import/mod";
import { store } from "./store/newDeepObservable";

import { Union } from "./compare.js";
import { cmyk } from "./styles/cmyk";

const types = { Union };

export {
  ui as element,
  ui as e,
  serviceWorker,
  m,
  m as module,
  store,
  types,
  cmyk,
};
