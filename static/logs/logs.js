export const pwd = cookie.pwd;
const server = await framework.load("log.js");

let logs = [];

const parseLogs = (logsList) => {
  for (let i of logsList) {
    let res = createLog(i.name, i.log);
    logs.push(res);
    res.ace.renderer.on("afterRender", () => {
      res.ace.scrollToLine(Infinity);
    });
  }
};

export const newLog = (log, name, fullLog) => {
  if (logs[logs.length - 1] && logs[logs.length - 1].name == name)
    logs[logs.length - 1].ace.setValue(
      logs[logs.length - 1].ace.getValue() + log,
      1
    );
  else {
    logs.push(createLog(name, fullLog));
  }
  logs[logs.length - 1].ace.scrollToLine(Infinity);
};

const createLog = (name, log) => {
  if (!log) return;
  let box = document.createElement("div");
  box.setAttribute("class", "box editorWrap editorPadding");
  let editorId = "editor" + Math.floor(Math.random() * 100000);
  let nameElem = document.createElement("h3");
  nameElem.innerText = name;
  nameElem.addEventListener("click", () => {
    cookie.service = name;
    window.location = "../service";
  });
  box.appendChild(nameElem);
  let editorWrap = document.createElement("div");
  let editor = document.createElement("div");
  editor.id = editorId;
  editor.setAttribute("class", "logEditor");
  editorWrap.appendChild(editor);
  box.appendChild(editorWrap);

  document
    .getElementById("content")
    .insertBefore(box, document.getElementById("content").firstChild);

  let logEditor = ace.edit(editorId);
  logEditor.setTheme("ace/theme/monokai");
  logEditor.session.setMode("ace/mode/text");
  logEditor.setReadOnly(true);
  logEditor.setValue(log, 1);

  return { element: box, ace: logEditor, name };
};

parseLogs(await server.getLogs(pwd));
