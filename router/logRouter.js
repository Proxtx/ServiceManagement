import { Router } from "express";
import { pwdCheck } from "../modules/config.js";
import { getLog } from "../services/logService.js";

export const router = Router();

router.post("/get", (req, res) => {
  if (!pwdCheck(req, res)) return;
  res.status(200).send(getLog(req.body.name));
});
