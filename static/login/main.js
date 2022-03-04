const server = await framework.load("login.js");

const pwd = document.getElementById("pwd");

pwd.addEventListener("change", async () => {
  cookie.pwd = pwd.value;
  if (await server.checkPwd(pwd.value)) window.location = "/";
  else pwd.value = "";
});
