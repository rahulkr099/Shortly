const isProduction = import.meta.env.VITE_NODE_ENV === "production";
const BASEURL = isProduction
  ? import.meta.env.VITE_PRODUCTION_BASEURL
  : import.meta.env.VITE_BASEURL;
const URL = isProduction
  ? import.meta.env.VITE_PRODUCTION_URL
  : import.meta.env.VITE_URL;

export { BASEURL, URL };
