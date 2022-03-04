import config from "@proxtx/config";
import { services } from "../private/services.js";

export const getCombineInfo = async (pwd, serviceName) => {
  if (pwd != config.pwd) return;
  let service = services[serviceName];
  if (!service) return;
  return await service.getCombineInfo();
};

export const writeCombineInfo = async (pwd, serviceName, combineInfo) => {
  if (pwd != config.pwd) return;
  let service = services[serviceName];
  if (!service) return;
  service.service.combineInfo = combineInfo;
  await service.overrideFile();
};
