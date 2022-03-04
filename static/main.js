cookie.pwd = "nicolas2005";

await framework.ws.addModule(await import("./overview.js"), "overview");

await framework.ws.serve();
