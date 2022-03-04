import { services } from "../services.js";

export const server = async (document, req, res) => {
  let service = services[req.cookies.service];
  if (!service) return;
  document.getElementById("path").innerText = service.service.path;
  document.getElementById("serviceName").innerText = service.service.name;
  document.getElementById("logEditor").innerText = service.process
    ? service.process.log
    : "";
  document.getElementById("configEditor").innerText = JSON.stringify(
    await service.readConfig(),
    null,
    2
  );
};
