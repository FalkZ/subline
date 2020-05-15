import { set } from "./idb";

export const serviceWorker = ({ id, path }: any = {}) => {
  set("service-worker", { id: id || "default-cache" });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(path || "/service-worker.js")
        .catch((e) =>
          console.error(
            `Could not load ${path || "/service-worker.js"}.
Create file in console:
echo "importScripts('../dist/service-worker.js');"  > service-worker.js

`,
            e
          )
        );
    });
  }
};
