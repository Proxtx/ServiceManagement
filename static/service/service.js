import { red, green } from "../colors.js";
const statusCircle = document.getElementById("statusCircle");
const startStop = document.getElementById("startStop");
const buttonWrap = document.getElementById("buttons");
const button = document.getElementsByClassName("button")[0];

export const updateRunningStatus = (status) => {
  statusCircle.style.backgroundColor = status ? green : red;
  startStop.src = status ? "stop.svg" : "play.svg";
};

export const logMessage = (log) => {
  logEditor.setValue(logEditor.getValue() + log, 1);
  logEditor.scrollToLine(Infinity);
};

export const displayInfo = (info) => {
  window.displayInfo(info);
};

export const buttons = (buttons) => {
  buttonWrap.innerHTML = "";
  for (let i of buttons) {
    let buttonInstance = button.cloneNode(true);
    buttonInstance.innerText = i;
    buttonInstance.addEventListener("click", () => {
      callButtonFunction(i);
    });
    buttonWrap.appendChild(buttonInstance);
  }
};

const callButtonFunction = async (button) => {
  let result = await window.server.pressButton(
    cookie.pwd,
    cookie.service,
    button
  );
  switch (result.action) {
    case "redirect":
      window.location = result.data;
      break;
    case "display":
      window.displayInfo(result.data);
      break;
  }
};

export const pwd = cookie.pwd;
export const service = cookie.service;
