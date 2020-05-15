| Name    | Alias |
| :------ | :---- |
| module  | m     |
| context | c     |
| element | e     |
| self    | s     |

```javascript
import { module, store, serviceWorker, types } from "subline";

const { Union } = types;

serviceWorker({ offline: true, routing: true });

const mainStore = store({ key: "value" }).types({ [String]: String });

module.test.fn({}).nest().shadow().css``.html``.on().attach();

element.img({});
```
