import { red, green } from "./colors.js";

const content = document.getElementById("content");
const serviceWidget = document.getElementsByClassName("serviceWidget")[0];

export const servicesUpdate = (services) => {
  content.innerHTML = "";
  for (let i of services) {
    let serviceWidgetInstance = serviceWidget.cloneNode(true);
    serviceWidgetInstance.children[0].style.backgroundColor = i.running
      ? green
      : red;
    serviceWidgetInstance.children[1].innerText = i.name;
    serviceWidgetInstance.addEventListener("click", () => {
      cookie.service = i.name;
      window.location = "./service";
    });
    content.appendChild(serviceWidgetInstance);
  }
};

export const pwd = cookie.pwd;
