import { Kafka } from "kafkajs";
import { reserveStock } from "../controllers/product.controller.js";
const kafka = new Kafka({
  clientId: "product", 
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "order-group" }); 
export const orderConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "order_created" });

    consumer.run({
      eachMessage: async ({ topic, partition, message}) => {
        const order = JSON.parse(message.value.toString());
        console.log("product Service received:", topic, order);
        reserveStock(order);
      },
    });
  } catch (err) {
    console.error(" Failed to start server:", err);
  }
};
export const producer = kafka.producer();
export const sendMessage = async (topic, message) => {
 await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: message }],
  });
  console.log(`Message sent to ${topic}: ${message}`);
};
