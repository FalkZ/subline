import { set } from "./idb";
import { version } from "../package.json";

export const serviceWorker = ({ id, path }: any = {}) => {
  set("service-worker", { id: id || "default-cache" });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(path || "/service-worker.js")
        .catch((e) =>
          console.error(
            `Could not load ${path || "/service-worker.js"}.
Create file with console:

echo "importScripts('https://unpkg.com/subline@${version}/dist/service-worker.js');"  > service-worker.js

`,
            e
          )
        );
    });
  }
};
