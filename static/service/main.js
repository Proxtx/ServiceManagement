const displayObject = (object) => {
  let obj = document.createElement("div");
  obj.setAttribute("class", "dataWrap");
  if (typeof object != "object" || object == undefined || object == null) {
    let v = document.createElement("a");
    v.innerText = object;
    return v;
  }
  if (Array.isArray(object)) {
    for (let i in object) {
      obj.appendChild(createAttribute(i, displayObject(object[i])));
    }
    return obj;
  }
  for (let i of Object.keys(object)) {
    let valueElem = document.createElement("a");
    valueElem.innerText = object[i];
    obj.appendChild(
      createAttribute(
        i,
        typeof object[i] == "object" && object[i]
          ? displayObject(object[i])
          : valueElem
      )
    );
  }

  return obj;
};

const createAttribute = (attribute, value) => {
  let wrap = document.createElement("div");
  let attributeElem = document.createElement("a");
  attributeElem.innerText = attribute + ": ";
  value.setAttribute("class", "dataValue");
  attributeElem.setAttribute("class", "dataAttribute");

  wrap.appendChild(attributeElem);
  wrap.appendChild(value);
  wrap.setAttribute("class", "attribute");
  return wrap;
};

window.displayInfo = (info) => {
  document.getElementById("dataTable").innerHTML = "";
  document.getElementById("dataTable").appendChild(displayObject(info));
};

while (!window.ace) {
  await new Promise((r) => setTimeout(r, 100));
}

const server = await framework.load("service.js");

window.server = server;

let configEditor = ace.edit("configEditor");
configEditor.setTheme("ace/theme/monokai");
configEditor.session.setMode("ace/mode/json");

let logEditor = ace.edit("logEditor");
logEditor.setTheme("ace/theme/monokai");
logEditor.session.setMode("ace/mode/text");
logEditor.setReadOnly(true);
logEditor.resize(true);
logEditor.scrollToLine(Infinity);

window.logEditor = logEditor;

let prevConfigValue = "";

const configWriteLoop = async () => {
  while (true) {
    if (prevConfigValue != configEditor.getValue()) {
      prevConfigValue = configEditor.getValue();
      await server.writeConfig(cookie.pwd, cookie.service, prevConfigValue);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
};

document.getElementById("startStop").addEventListener("click", () => {
  server.changeServiceStatus(cookie.pwd, cookie.service);
});

configWriteLoop();

framework.ws.addModule(await import("./service.js"), "service");

framework.ws.serve();
