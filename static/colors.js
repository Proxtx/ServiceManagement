const api = await framework.load("style.js");

let style = await api.style;

export const red = style.red;
export const green = style.green;

for (let i of Object.keys(style))
  document.documentElement.style.setProperty("--" + i, style[i]);
