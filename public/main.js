let editorConfig = ace.edit("editorConfig");
editorConfig.setTheme("ace/theme/monokai");
editorConfig.session.setMode("ace/mode/json");

editorConfig.getSession().on("change", () => saveTimeout());

let editorLog = ace.edit("editorLog");
editorLog.setTheme("ace/theme/monokai");
editorLog.session.setMode("ace/mode/text");
editorLog.setReadOnly(true);

const serviceWidgetStart = (name, status) => {
  let widget = genServiceWidget(name, status);
  widget.addEventListener("click", () => {
    viewService(name);
  });
  document.getElementById("start").appendChild(widget);
};

const genServiceWidget = (name, status) => {
  let serviceWidget = document
    .getElementsByClassName("serviceWidget")[0]
    .cloneNode(true);
  genStatusColors(serviceWidget.children[0], status);
  serviceWidget.children[1].innerText = name;
  return serviceWidget;
};

const genStatusColors = (elem, status) => {
  if (status) {
    elem.classList.remove("backgroundRed");
    elem.classList.remove("backgroundGreen");
    elem.classList.add("backgroundGreen");
  } else {
    elem.classList.remove("backgroundGreen");
    elem.classList.remove("backgroundRed");
    elem.classList.add("backgroundRed");
  }
};

const Fetch = async (
  url,
  json,
  options = { method: "POST", headers: { "Content-Type": "application/json" } }
) => {
  if (!window.localStorage.getItem("pwd")) {
    window.localStorage.setItem("pwd", prompt("PWD"));
  }
  json.pwd = window.localStorage.getItem("pwd");
  options.body = JSON.stringify(json);
  const result = await fetch(url, options);
  const resultJson = await result.json();
  if (resultJson.error == "auth") {
    window.localStorage.setItem("pwd", prompt("PWD"));
    return { success: false };
  }
  return resultJson;
};

const prepareStartScreen = async () => {
  document.getElementById("start").innerHTML = "";
  const services = await Fetch("api/service/services", {});
  if (!services.success) return;
  for (let i in services.services) {
    serviceWidgetStart(services.services[i].name, services.services[i].active);
  }
};

let saveConfig = false;

const genServiceScreen = async (service) => {
  const serviceInfo = await Fetch("api/service/service", {
    name: service,
  });
  const config = await Fetch("api/config/get", {
    name: service,
  });
  const log = await Fetch("api/log/get", {
    name: service,
  });
  const buttons = await Fetch("api/button/list", {
    name: service,
  });

  clearTable();

  if (serviceInfo.success) {
    document.getElementById("mainServiceName").innerText = serviceInfo.name;
    genStatusColors(
      document.getElementById("mainServiceStatus"),
      serviceInfo.active
    );
    document.getElementById("mainServicePath").innerText = serviceInfo.path;
    showStatusButton(serviceInfo.active);
    var el = document.getElementById("mainStatusControl"),
      elClone = el.cloneNode(true);

    el.parentNode.replaceChild(elClone, el);
    if (serviceInfo.active) {
      document
        .getElementById("mainStatusControl")
        .addEventListener("click", async () => {
          await stopService(service);
          genServiceScreen(service);
        });
    } else {
      document
        .getElementById("mainStatusControl")
        .addEventListener("click", async () => {
          await startService(service);
          genServiceScreen(service);
        });
    }
    for (let i in serviceInfo.table) {
      addRowTable(serviceInfo.table[i][0], serviceInfo.table[i][1]);
    }
  }
  if (config.success) {
    editorConfig.setValue(config.text, 1);
    if (config.exists) {
      saveConfig = true;
    } else {
      saveConfig = false;
    }
  }
  if (log.success) {
    editorLog.setValue(log.log, 1);
  }
  if (buttons.success) {
    document.getElementsByClassName("buttonBox")[0].innerHTML = "";
    for (let i in buttons.buttons) {
      genButton(service, buttons.buttons[i]);
    }
  }
};

const clearTable = () => {
  document.getElementById("mainInfoTable").innerHTML = "";
};

const addRowTable = (key, value) => {
  const left = document
    .getElementsByClassName("gridBoxLeft")[0]
    .cloneNode(true);
  left.children[0].innerText = key;
  const right = document
    .getElementsByClassName("gridBoxRight")[0]
    .cloneNode(true);
  right.children[0].innerText = value;

  document.getElementById("mainInfoTable").appendChild(left);
  document.getElementById("mainInfoTable").appendChild(right);
};

const showStatusButton = (status) => {
  if (status) {
    document.getElementById("mainStatusControl").src = "stop.svg";
  } else {
    document.getElementById("mainStatusControl").src = "play.svg";
  }
};

const showScreen = (screen) => {
  switch (screen) {
    case "start":
      document.getElementById("start").style.display = "grid";
      document.getElementById("main").style.display = "none";
      break;
    case "main":
      document.getElementById("start").style.display = "none";
      document.getElementById("main").style.display = "unset";
      break;
  }
};

let currentService;

const viewService = (name) => {
  currentService = name;
  genServiceScreen(name);
  createNewSocketHandler(name);
  showScreen("main");
};

let currentSaveNumber = 000;

const saveTimeout = async () => {
  if (!saveConfig) return;
  const saveNumber = Math.floor(Math.random() * 100000);
  currentSaveNumber = saveNumber;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (currentSaveNumber == saveNumber) {
    saveConfigChanges();
  }
};

const saveConfigChanges = async () => {
  await Fetch("api/config/set", {
    name: currentService,
    config: editorConfig.getValue(),
  });
};

const startService = async (name) => {
  await Fetch("api/service/start", {
    name: name,
  });
};

const stopService = async (name) => {
  await Fetch("api/service/stop", {
    name: name,
  });
};

let currentSocketHandler = {};

const createNewSocketHandler = async (name) => {
  currentSocketHandler.enabled = false;
  const socketHandlerInstance = new socketHandler();
  socketHandlerInstance.init();
  socketHandlerInstance.subscribe(
    "service",
    name,
    window.localStorage.getItem("pwd") || 0
  );
  socketHandlerInstance.onMessage.push((msg) => {
    genServiceScreen(name);
  });
  currentSocketHandler = socketHandlerInstance;
};

const genButton = async (service, buttonName) => {
  let button = document.getElementsByClassName("button")[0].cloneNode(true);
  button.innerText = buttonName;
  button.addEventListener("click", async () => {
    await Fetch("api/button/click", {
      name: service,
      button: buttonName,
    });
    genServiceScreen();
  });
  document.getElementsByClassName("buttonBox")[0].appendChild(button);
};

prepareStartScreen();
showScreen("start");
