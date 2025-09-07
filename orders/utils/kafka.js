import { Kafka } from "kafkajs";
import Order from "../models/order.js";

const kafka = new Kafka({
  clientId: "order", 
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();
export const sendMessage = async (topic, message) => {
 await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: message }],
  });
  console.log(` Message sent to ${topic}: ${message}`);
};

const consumer = kafka.consumer({ groupId: "order_status" });
export const productConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "order_status" });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          console.log(" Order Service received:", topic, data);
           console.log("coming to change order collection");

          const { orderId, status } = data; 
          const result = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
          );
         
          if (!result) {
            console.log(`Order ${orderId} not found`);
          } else {
            console.log(`Order ${orderId} updated to ${status}`);
          }
        } catch (err) {
          console.error("Error handling Kafka message:", err.message);
        }
      },
    });
  } catch (err) {
    console.error("Failed to start consumer:", err.message);
  }
};