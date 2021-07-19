import {
  startService as startServiceManagement,
  stopService as stopServiceManagement,
} from "../modules/processManagement.js";
import { processes } from "../modules/processWrap.js";
import { services } from "../modules/config.js";
import { getConfig } from "./configService.js";

export const startService = async (name) => {
  return await startServiceManagement(name);
};

export const stopService = async (name) => {
  if (!processes[name]) return { success: false };
  return await stopServiceManagement(name);
};

export const getServices = () => {
  let result = [];
  for (let i in services) {
    result.push({ name: i, active: processes[i] ? true : false });
  }
  return { success: true, services: result };
};

export const serviceInfo = async (name) => {
  if (!services[name]) return;
  const table = await genTable(name);
  return {
    success: true,
    name: name,
    active: processes[name] ? true : false,
    path: services[name].path,
    table: table,
  };
};

const genTable = async (name) => {
  const configExists = (await getConfig(name)).exists;
  const arr = [
    [
      "Uptime",
      processes[name]
        ? new Date(processes[name].startTime).toLocaleString()
        : "00:00:00",
    ],
    ["run cmd", services[name].run],
    ["Type", services[name].run.split(" ")[0]],
    ["config", configExists],
    ["pid", processes[name] ? processes[name].pid : "Service not running"],
  ];
  return arr;
};
