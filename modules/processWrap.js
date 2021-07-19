import { spawn, exec } from "child_process";

export let processes = {};

export const startProcess = async (name, path, run) => {
  run = run.split(" ");
  processes[name] = await spawn(run.shift(), run, {
    cwd: path,
  });
  processes[name].startTime = Date.now();
  return processes[name];
};

export const stopProcess = async (name) => {
  if (processes[name]) {
    await processes[name].kill();
  }
  delete processes[name];
};
