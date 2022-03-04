import { listen } from "@proxtx/framework";
import config from "@proxtx/config";
import { service, overview, logs } from "./private/socketHandler.js";
import process from "process";

process.setMaxListeners(100);

const result = await listen(config.port);

const handler = await result.combineHandler(result.server);
handler.onCombine("service", async (combine, options) => {
  try {
    await service(combine, options);
  } catch (e) {
    console.log(e);
  }
});
handler.onCombine("overview", async (combine, options) => {
  try {
    await overview(combine, options);
  } catch (e) {
    console.log(e);
  }
});
handler.onCombine("logs", async (combine, options) => {
  try {
    await logs(combine, options);
  } catch (e) {
    console.log(e);
  }
});

console.log("Server Started. Port:", config.port);
