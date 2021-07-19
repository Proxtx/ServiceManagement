import { Router } from "express";
import {
  startService,
  stopService,
  getServices,
  serviceInfo,
} from "../services/serviceService.js";
import { pwdCheck } from "../modules/config.js";

export const router = Router();

router.post("/start", async (req, res) => {
  if (!pwdCheck(req, res)) return;
  res.status(200).send(await startService(req.body.name));
});

router.post("/stop", async (req, res) => {
  if (!pwdCheck(req, res)) return;
  res.status(200).send(await stopService(req.body.name));
});

router.post("/services", (req, res) => {
  if (!pwdCheck(req, res)) return;
  res.status(200).send(getServices());
});

router.post("/service", async (req, res) => {
  if (!pwdCheck(req, res)) return;
  res.status(200).send(await serviceInfo(req.body.name));
});
