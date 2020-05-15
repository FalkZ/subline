import { set } from "./idb";

export const serviceWorker = ({ id }: any = {}) => {
  set("service-worker", { id: id || "default-cache" });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch((e) =>
        console.error(
          `Could not load /service-worker.js.
Create file in console:
echo "importScripts('./dist/service-worker.js');"  > service-worker.js

`,
          e
        )
      );
    });
  }
};
