while (!window.ace) {
  await new Promise((r) => setTimeout(r, 100));
}

await framework.ws.addModule(await import("./logs.js"), "logs");
await framework.ws.serve();
