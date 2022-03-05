import { logs } from "../private/services.js";
import config from "@proxtx/config";

export const getLogs = (pwd) => {
  if (pwd != config.pwd) return;
  return logs;
};
