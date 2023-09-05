import App from "./App.svelte";

const app = new App({
  target: document.body,
  hydrate: true,
});

console.log("test");

export default app;
