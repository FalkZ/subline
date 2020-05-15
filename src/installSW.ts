import "./idb";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    localStorage.setItem("t", "123");
    navigator.serviceWorker
      .register("/service-worker.js#test")
      .catch(console.log);
  });
}
