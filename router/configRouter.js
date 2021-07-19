import express from "express";
import { getConfig, setConfig } from "../services/configService.js";
import { pwdCheck } from "../modules/config.js";

export const router = express.Router();

router.post("/get", async (req, res) => {
  if (!pwdCheck(req, res)) return;
  res.status(200).send(await getConfig(req.body.name));
});

router.post("/set", async (req, res) => {
  if (!pwdCheck(req, res)) return;
  res.status(200).send(await setConfig(req.body.name, req.body.config));
});
