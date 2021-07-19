import { services } from "./config.js";
import { startProcess, stopProcess } from "./processWrap.js";
import { processes } from "./processWrap.js";
import { logListener } from "../services/logService.js";
import stripColor from "strip-color";
import { subscribeCheck } from "./socketHandler.js";
import { config } from "./config.js";
import { sendMessage, subs } from "../modules/socketHandler.js";

export const startService = async (name) => {
  if (!services[name]) return { success: false };
  if (processes[name]) return { success: false };
  await startProcess(name, services[name].path, services[name].run);
  appendServices(name);
  return { success: true };
};

const appendServices = (name) => {
  processes[name].stdout.on("data", (data) =>
    logListener(name, stripColor(data.toString()))
  );
  processes[name].stderr.on("data", (data) =>
    logListener(name, stripColor(data.toString()))
  );
  processes[name].addListener("close", stopService.bind({}, name));
};

export const stopService = async (name) => {
  await stopProcess(name);
  stopAppendedServices(name);
  notifyListeners(name);
  return { success: true };
};

const stopAppendedServices = (name) => {};

subscribeCheck.push((cmdChain) => {
  if (config.pwd === cmdChain[3]) {
    return true;
  }
  return false;
});

export const notifyListeners = (name) => {
  for (let i in subs.service[name]) {
    sendMessage("service", name, i, "reload");
  }
};
