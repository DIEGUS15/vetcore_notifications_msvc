import express from "express";
import dotenv from "dotenv";
import { connectRabbitMQ, closeConnection } from "./src/config/rabbitmq.js";
import { verifyEmailConfig } from "./src/config/mailer.js";
import { startClientCreatedConsumer } from "./src/events/consumers/clientCreatedConsumer.js";
import { startUserCreatedByAdminConsumer } from "./src/events/consumers/userCreatedByAdminConsumer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Email Service API working correctly" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const startServer = async () => {
  try {
    await verifyEmailConfig();

    await connectRabbitMQ();

    await startClientCreatedConsumer();
    await startUserCreatedByAdminConsumer();

    app.listen(PORT, () => {
      console.log(`Email Service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await closeConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await closeConnection();
  process.exit(0);
});

startServer();
