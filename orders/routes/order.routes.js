import express from "express";
import { createOrder, listOrders, getOrderById } from "../controllers/order.controller.js";

const router = express.Router();
router.post("/create", createOrder);
router.get("/", listOrders);
router.get("/:id", getOrderById);
router.get("/test", (req, res) => {
  res.send("Orders route working");
});

export default router;
