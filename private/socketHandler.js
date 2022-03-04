import {
  services,
  events as serviceEvents,
  logs as logsList,
} from "./services.js";
import config from "@proxtx/config";

export const service = async (combine, options) => {
  if ((await combine.pwd) != config.pwd) return;
  const service = services[await combine.service];
  if (!service) return;
  combine.updateRunningStatus(service.process ? true : false);
  service.events.addEventListener("start", async () => {
    if (!options.connected) return;
    combine.updateRunningStatus(true);
    combine.displayInfo(await infoQuery(service));
    return true;
  });
  service.events.addEventListener("stop", async () => {
    if (!options.connected) return;
    combine.updateRunningStatus(false);
    combine.displayInfo(await infoQuery(service));
    return true;
  });
  service.events.addEventListener("log", (log) => {
    if (!options.connected) return;
    combine.logMessage(log);
    return true;
  });

  combine.displayInfo(await infoQuery(service));
  combine.buttons(await service.getButtons());
};
export const overview = async (combine, options) => {
  if ((await combine.pwd) != config.pwd) return;
  updateOverview(combine, options);
  serviceEvents.addEventListener("update", () => {
    return updateOverview(combine, options);
  });
  serviceEvents.addEventListener("start", () => {
    return updateOverview(combine, options);
  });
  serviceEvents.addEventListener("stop", () => {
    return updateOverview(combine, options);
  });
};
export const logs = async (combine, options) => {
  if ((await combine.pwd) != config.pwd) return;
  await combine.sendLogs(logsList);
  serviceEvents.addEventListener("log", async (log, service) => {
    if (!options.connected) return;
    await combine.newLog(log, service);
    return true;
  });
};

const generateParsedServices = () => {
  let servicesParsed = [];
  for (let i of Object.keys(services)) {
    servicesParsed.push({
      name: i,
      running: services[i].process ? true : false,
    });
  }
  return servicesParsed;
};

const updateOverview = async (combine, options) => {
  if (!options.connected) return false;
  await combine.servicesUpdate(generateParsedServices());
  return true;
};

const infoQuery = async (service) => {
  let result = JSON.parse(
    JSON.stringify(service, (key, value) => {
      if (key == "git") return undefined;
      return value;
    })
  );
  delete result.events;
  delete result.service.combineInfo;
  let process = {};
  if (result.process) {
    delete result.process.events;
    result.process.startTime = new Date(result.process.startTime);
    process.pid = result.process.process.pid;
    delete result.process.log;
    result.process.process = process;
  }
  try {
    result.combine = await service.getCombineInfo();
  } catch (e) {
    result.combine = e;
  }
  return result;
};
