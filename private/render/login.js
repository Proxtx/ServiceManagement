import config from "@proxtx/config";

export const server = (document, options) => {
  if (options.req.cookies.pwd != config.pwd)
    document.innerHTML = "<script>window.location = '/login'</script>";
};
