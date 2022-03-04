import config from "@proxtx/config";

export const checkPwd = (pwd) => {
  return pwd == config.pwd;
};
