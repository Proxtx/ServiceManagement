import config from "@proxtx/config";
import { services } from "../private/services.js";

export const writeConfig = (pwd, serviceName, configText) => {
  if (pwd != config.pwd) return;
  let service = services[serviceName];
  if (!service) return;
  service.writeConfig(configText);
};

export const changeServiceStatus = (pwd, serviceName) => {
  if (pwd != config.pwd) return;
  let service = services[serviceName];
  if (!service) return;
  if (service.process) service.process.kill();
  else service.start();
};

export const pressButton = async (pwd, serviceName, button) => {
  if (pwd != config.pwd) return;
  let service = services[serviceName];
  if (!service) return;
  return await service.button(button);
};
