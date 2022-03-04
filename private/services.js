import { promises as fs } from "fs";
import { startProcess } from "./process.js";
import { EventHandler } from "./events.js";
import fetch from "node-fetch";
import git from "simple-git";

export const events = new EventHandler();

export const services = {};

export let logs = [];

export let servicesFile;

const addToLog = (log, service) => {
  if (logs[logs.length - 1] != service) logs.push(service);
  if (logs.length > 20) logs.shift();
  return true;
};

events.addEventListener("log", addToLog);

const reloadServices = async () => {
  servicesFile = JSON.parse(await fs.readFile("services.json", "utf-8"));
  for (let i of Object.keys(servicesFile)) {
    if (!services[i]) services[i] = new Service(servicesFile[i], i);
    services[i].service = { ...services[i].service, ...servicesFile[i] };
  }
  events.evoke("update");
  setTimeout(reloadServices, 20000);
};

class Service {
  service;
  process;
  events = new EventHandler();
  config;
  constructor(service, name) {
    this.service = service;
    service.name = name;
    if (this.service.autoStart) {
      this.start();
    }

    this.gitLoop();
  }

  gitLoop = async () => {
    if (!this.git && this.service.git) {
      this.git = git(this.service.path);
    }

    if (this.git) {
      try {
        let res = await this.git.pull();
        if (res.changes > 0 && this.process) {
          await this.process.kill();
          this.start();
        }
      } catch (e) {
        console.log(e);
      }
    }

    setTimeout(this.gitLoop, 30 * 60 * 1000);
  };

  start = async () => {
    this.process = await startProcess(this.service.path, this.service.run);
    this.process.events.addEventListener("close", () => {
      this.process = null;
      this.events.evoke("stop", this);
      events.evoke("stop");
      if (this.service.restart) {
        this.start();
      }
    });
    this.process.events.addEventListener("log", (log) => {
      this.events.evoke("log", log);
      events.evoke("log", log, this);
      return true;
    });

    this.events.evoke("start", this);
    events.evoke("start");
  };

  readConfig = async () => {
    let configPath = this.service.config
      ? this.service.config
      : this.service.path + "/config.json";
    try {
      this.config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    } catch (e) {
      console.log(e);
    }
    return this.config;
  };

  writeConfig = async (config) => {
    let configPath = this.service.config
      ? this.service.config
      : this.service.path + "/config.json";
    try {
      JSON.parse(config);
      await fs.readFile(configPath, "utf-8");
      await fs.writeFile(configPath, config);
    } catch {}
  };

  getCombineInfo = async () => {
    if (!this.process || !this.service.combine) return;
    let modules = (await Fetch(this.service.combine + "/data", { info: true }))
      .modules;
    for (let i in modules) {
      modules[i].exports = (
        await Fetch(this.service.combine + "/data", {
          info: true,
          module: modules[i].name,
        })
      ).exports;
      for (let r of Object.keys(modules[i].exports)) {
        if (!modules[i].exports[r].function) {
          modules[i].exports[r].value = await this.runCombine(
            modules[i].name,
            r,
            []
          );
        } else if (
          this.service.combineInfo &&
          this.service.combineInfo[i] &&
          this.service.combineInfo[i].name == modules[i].name &&
          this.service.combineInfo[i].exports[r]
        ) {
          modules[i].exports[r] = this.service.combineInfo[i].exports[r];
        }
      }
    }
    this.service.combineInfo = modules;
    return modules;
  };

  runCombine = async (module, exportName, argumentsArray) => {
    return (
      await Fetch(this.service.combine + "/data", {
        module,
        export: exportName,
        arguments: argumentsArray,
      })
    ).data;
  };

  getButtons = async () => {
    let buttons = ["Clear Logs", "Edit Combine"];
    if (this.service.combineInfo) {
      for (let i of this.service.combineInfo) {
        for (let r of Object.keys(i.exports)) {
          buttons.push(i.name + " " + r);
        }
      }
    }

    return buttons;
  };

  button = async (button) => {
    try {
      if (button == "Clear Logs") {
        if (this.process) this.process.log = "";
        return { action: "redirect", data: "./" };
      } else if (button == "Edit Combine") {
        return { action: "redirect", data: "../combine" };
      } else if (this.service.combineInfo) {
        let split = button.split(" ");
        let mod;
        for (let i of this.service.combineInfo) {
          if (i.name == split[0]) {
            mod = i;
          }
        }
        let exportObj = mod.exports[split[1]];
        return {
          action: "display",
          data: await this.runCombine(
            mod.name,
            split[1],
            exportObj.arguments ? exportObj.arguments : []
          ),
        };
      }
    } catch (e) {
      console.log(e);
    }
  };

  overrideFile = async () => {
    try {
      let file = JSON.parse(await fs.readFile("services.json", "utf-8"));
      file[this.service.name] = this.service;
      await fs.writeFile("services.json", JSON.stringify(file, null, 2));
    } catch {}
  };
}

const Fetch = async (url, json = {}, headers = {}, options = {}) => {
  return await (
    await fetch(url, {
      ...{
        method: "POST",
        headers: {
          ...{
            "Content-Type": "application/json",
          },
          ...headers,
        },
        body: JSON.stringify(json),
      },
      ...options,
    })
  ).json();
};

reloadServices();
