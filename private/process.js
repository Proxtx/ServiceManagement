import { EventHandler } from "./events.js";
import { spawn } from "child_process";
import stripColor from "strip-color";

export const events = new EventHandler();

export const startProcess = async (path, run) => {
  run = run.split(" ");
  let process = new Process(
    await spawn(run.shift(), run, {
      cwd: path,
    })
  );
  events.evoke("start", process);

  return process;
};

class Process {
  events = new EventHandler();
  process;
  startTime;
  log = "";

  constructor(process) {
    this.process = process;
    this.startTime = Date.now();

    this.process.stdout.on("data", (data) =>
      this.message(stripColor(data.toString()))
    );
    this.process.stderr.on("data", (data) =>
      this.message(stripColor(data.toString()))
    );
    this.process.addListener("close", () => {
      this.events.evoke("close");
      events.evoke("close", this);
    });
  }

  message = (message) => {
    if (this.log.length > 100000) this.log = this.log.substring(50000);
    this.log += message;
    this.events.evoke("log", message);
  };

  kill = () => {
    this.process.kill();
  };
}
