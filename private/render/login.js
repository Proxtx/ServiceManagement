import config from "@proxtx/config";

export const server = (document, req, res) => {
  if (req.cookies.pwd != config.pwd)
    document.innerHTML = "<script>window.location = '/login'</script>";
};
