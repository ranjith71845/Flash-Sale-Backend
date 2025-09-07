import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import productRoutes from "./routes/product.routes.js";
import { orderConsumer } from "./utils/kafka.js";

//import orderRoutes from "./routes/order.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
mongoose.connect(process.env.MONGO_URI, { dbName: "TASK1" })
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.error(" MongoDB connection error:", err));

app.use("/products", productRoutes);
orderConsumer();

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});