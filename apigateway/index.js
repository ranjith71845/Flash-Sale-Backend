import express from "express";
import dotenv from "dotenv";
import authProxy from "./routes/auth.proxy.js";
import productProxy from "./routes/product.proxy.js";
import orderProxy from "./routes/order.route.js";

dotenv.config();
const app = express();


app.use("/auth", authProxy);
app.use("/products", productProxy);
app.use("/orders", orderProxy);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
