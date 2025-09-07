import { createProxyMiddleware } from "http-proxy-middleware";
import { AUTH_SERVICE } from "../utils/serviceUrls.js";
const authProxy = createProxyMiddleware({
  target: AUTH_SERVICE,  
  changeOrigin: true,
});
export default authProxy;
