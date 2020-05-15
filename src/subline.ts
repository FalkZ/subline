import { ui } from "./ui";
import { serviceWorker } from "./installSW";
import { m } from "./mod";
import { store } from "./newDeepObservable";

import { Union } from "./compare.js";

const types = { Union };

export { ui as element, ui as e, serviceWorker, m, m as module, store, types };
