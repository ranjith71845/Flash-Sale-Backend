import Order from "../models/order.js";
import Outbox from "../models/outbox.js";
import { sendMessage } from "../utils/kafka.js"; 

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.body.userId,
      products: req.body.products,
      totalAmount: req.body.products.reduce((sum, i) => sum + i.price * i.quantity, 0)
    });

    await Outbox.create({
      aggregateType: "Order",
      aggregateId: order._id,
      type: "ORDER_CREATED",
      payload: order
    });

    console.log('....order creating....')
     await sendMessage("order_created", JSON.stringify(order));
    console.log("Order created event sent to Kafka");

    res.status(201).json(order);

  } catch (err) {
    console.error("Error creating order:", err);
    res.status(400).json({ message: err.message });
  }
};

export const listOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};
