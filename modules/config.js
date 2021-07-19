import fs from "fs";

export const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
export const services = JSON.parse(fs.readFileSync("./services.json", "utf-8"));

export const pwdCheck = (req, res) => {
  if (req.body.pwd !== config.pwd)
    res.status(200).send({ success: false, error: "auth" });
  return req.body.pwd === config.pwd;
};
