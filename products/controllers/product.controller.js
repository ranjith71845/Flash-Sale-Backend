import Product from "../models/Product.js";
import  {sendMessage}  from "../utils/kafka.js";

export const addProduct = async (req, res) => {
    console.log("ff");
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId)
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message });
  }
};
export const updateStock = async (req, res) => {
  try {
    const { productId, stock,name,price } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { stock,name,price},
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const reserveStock = async (data) => {
  try {
    console.log(data);
    const { userId, products,_id } = data;
      for (let item of products) {
        console.log(item);
          const product = await Product.findOneAndUpdate(
         { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
         { new: true }
      );
      if (!product) {        
      console.log("product not found");
      await sendMessage("order_status", JSON.stringify({
        orderId:_id,
        status:"Failed"
      }));
      break;
    }
    else{
       console.log("Order status successfully");
       await sendMessage("order_status", JSON.stringify({
        orderId:_id,
        status:"Success"
      }));
    }
    }
  } catch (err) {
     await sendMessage("order_status", JSON.stringify({
        orderId:_id,
        status:"Failed"
      }));
    console.log("reversestock error");
  }
};
