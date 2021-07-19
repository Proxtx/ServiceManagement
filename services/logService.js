import { services } from "../modules/config.js";
import { notifyListeners } from "../modules/processManagement.js";

let logs = {};

export const logListener = (name, log) => {
  if (services[name]) {
    logs[name] ? (logs[name] += log) : (logs[name] = log);
    notifyListeners(name);
  }
};

export const getLog = (name) => {
  return { success: true, log: logs[name] || "" };
};
