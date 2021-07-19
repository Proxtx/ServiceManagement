import fetch from "node-fetch";

export const showReloadButton = async () => {
  while (true) {
    await fetch(
      "http://localhost:" + (process.argv[2] || 80) + "/api/button/add",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "ServiceManagement",
          button: "Stop",
        }),
      }
    );
    process.exit();
  }
};
