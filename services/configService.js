import fs from "fs";

import { services } from "../modules/config.js";

export const getConfig = async (name) => {
  try {
    return {
      success: true,
      exists: true,
      text: fs.readFileSync(
        services[name].path + "/" + (services[name].config || "config.json"),
        "utf-8"
      ),
    };
  } catch (e) {
    return { success: true, exists: false, text: "No config.json" };
  }
};

export const setConfig = async (name, config) => {
  await new Promise((resolve) => {
    fs.writeFile(
      services[name].path + "/" + (services[name].config || "config.json"),
      config,
      resolve
    );
  });

  return { success: true };
};
