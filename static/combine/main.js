const server = await framework.load("combine.js");

let combineInfo = await server.getCombineInfo(cookie.pwd, cookie.service);
if (!combineInfo) window.location = "../service/";

const computedBackgroundColor = window
  .getComputedStyle(document.body)
  .getPropertyValue("background-color");

const displayCombineInfo = (combineInfo) => {
  for (let i of combineInfo) {
    let moduleElem = document.createElement("div");
    moduleElem.setAttribute("class", "box");
    moduleElem.style.flexDirection = "column";
    moduleElem.style.alignItems = "flex-start";
    let elemTitle = document.createElement("h4");
    elemTitle.innerText = i.name;
    moduleElem.appendChild(elemTitle);
    for (let r of Object.keys(i.exports)) {
      let exportObj = i.exports[r];
      if (!exportObj.function) {
        let box = createExportBox(r);
        let valueElem = document.createElement("p");
        valueElem.innerText = exportObj.value;
        box.appendChild(valueElem);
        moduleElem.appendChild(box);
      } else {
        let box = createExportBox(r);
        let inputWrap = document.createElement("div");
        if (!i.exports[r].arguments) i.exports[r].arguments = [];
        for (let x in i.exports[r].arguments) {
          inputWrap.appendChild(
            createAttributeInput(i.exports[r].arguments, x)
          );
        }
        box.appendChild(inputWrap);
        let addAtt = document.createElement("button");
        addAtt.innerText = "Add Attribute";
        addAtt.setAttribute("class", "button");
        addAtt.addEventListener("click", () => {
          i.exports[r].arguments.push("");
          inputWrap.appendChild(
            createAttributeInput(
              i.exports[r].arguments,
              i.exports[r].arguments.length - 1
            )
          );
        });
        let rmvAtt = document.createElement("button");
        rmvAtt.innerText = "Remove Attribute";
        rmvAtt.setAttribute("class", "button");
        rmvAtt.addEventListener("click", () => {
          inputWrap.removeChild(
            inputWrap.children[inputWrap.children.length - 1]
          );
          i.exports[r].arguments.pop();
        });
        box.appendChild(addAtt);
        box.appendChild(rmvAtt);
        moduleElem.appendChild(box);
      }
    }
    document.getElementById("content").appendChild(moduleElem);
  }
};

const createExportBox = (name) => {
  let box = document.createElement("div");
  box.setAttribute("class", "box");
  let text = document.createElement("h4");
  text.innerText = name;
  box.appendChild(text);
  box.style.backgroundColor = computedBackgroundColor;
  box.style.flexDirection = "column";
  box.style.alignItems = "flex-start";
  return box;
};

const createAttributeInput = (argumentsArray, index) => {
  let input = document.createElement("input");
  input.setAttribute("class", "input");
  input.style.marginTop = "10px";
  input.value = argumentsArray[index];
  input.placeholder = index;
  input.addEventListener("change", () => {
    if (Number(input.value)) argumentsArray[index] = Number(input.value);
    else argumentsArray[index] = input.value;
  });
  return input;
};

document.getElementById("save").addEventListener("click", async () => {
  await server.writeCombineInfo(cookie.pwd, cookie.service, combineInfo);
  window.location = "../service";
});

displayCombineInfo(combineInfo);
