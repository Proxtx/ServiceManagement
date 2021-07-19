import express from "express";

const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

import { router as configRouter } from "./router/configRouter.js";
import { router as logRouter } from "./router/logRouter.js";
import { router as serviceRouter } from "./router/serviceRouter.js";
import { router as buttonRouter } from "./router/buttonRouter.js";

import * as socketHandler from "./modules/socketHandler.js";
import { showReloadButton } from "./modules/button.js";

process.on("uncaughtException", function (err) {
  console.log(err);
});

app.use("", express.static("public"));
app.use(express.json());

app.use("/api/config", configRouter);
app.use("/api/log", logRouter);
app.use("/api/service", serviceRouter);
app.use("/api/button", buttonRouter);

socketHandler.init(io);
server.listen(process.argv[2] || 80);

showReloadButton();
