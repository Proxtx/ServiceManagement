export const pwd = cookie.pwd;

let logs = [];

export const sendLogs = (logsList) => {
  for (let i of logsList) {
    let res = createLog(i.service.name, i.process ? i.process.log : "");
    logs.push(res);
  }
};

export const newLog = (log, service) => {
  if (
    logs[logs.length - 1] &&
    logs[logs.length - 1].name == service.service.name
  )
    logs[logs.length - 1].ace.setValue(
      logs[logs.length - 1].ace.getValue() + log,
      1
    );
  else {
    logs.push(
      createLog(
        service.service.name,
        service.process ? service.process.log : ""
      )
    );
  }
};

const createLog = (name, log) => {
  let box = document.createElement("div");
  box.setAttribute("class", "box editorWrap editorPadding");
  let editorId = "editor" + Math.floor(Math.random() * 100000);
  let nameElem = document.createElement("h3");
  nameElem.innerText = name;
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
