import { createProxyMiddleware } from "http-proxy-middleware";
import { ORDER_SERVICE } from "../utils/serviceUrls.js";
import express from "express";
import verifyJWT from "../middleware/verifyjwt.js";

const router = express.Router();

router.use(
  "/",
  verifyJWT, 
  createProxyMiddleware({
    target: ORDER_SERVICE,
    changeOrigin: true,
   
  })
);

export default router;
