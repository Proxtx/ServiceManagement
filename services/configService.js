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
  const path =
    services[name].path + "/" + (services[name].config || "config.json");
  let exists = false;

  await new Promise((resolve) =>
    fs.access(path, fs.F_OK, (err) => {
      if (err) {
        resolve();
        return;
      }
      exists = true;
      resolve();
    })
  );

  if (exists)
    await new Promise((resolve) => {
      fs.writeFile(path, config, resolve);
    });

  return { success: true };
};
