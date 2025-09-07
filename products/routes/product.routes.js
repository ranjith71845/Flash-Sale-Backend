import express from "express";
import {
  addProduct,
  listProducts,
  getProductById,
  updateStock,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/list", listProducts);
router.get("/get/:productId", getProductById);
router.post("/add",addProduct); 
router.put("/stock",updateStock); 
router.delete("/productId",deleteProduct);
router.get("/", (req, res) => {
  res.send(" product is running!");
});

export default router;
