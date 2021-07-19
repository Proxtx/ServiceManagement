import express from "express";
import {
  listButtons,
  addButton,
  buttonClick,
} from "../services/buttonService.js";
import { pwdCheck } from "../modules/config.js";

export const router = express.Router();

router.post("/list", (req, res) => {
  if (!pwdCheck(req, res)) return;
  res.status(200).send(listButtons(req.body.name));
});

router.post("/add", async (req, res) => {
  res.status(200).send(await addButton(req.body.name, req.body.button));
});

router.post("/click", (req, res) => {
  if (!pwdCheck(req, res)) return;
  res.status(200).send(buttonClick(req.body.name, req.body.button));
});
