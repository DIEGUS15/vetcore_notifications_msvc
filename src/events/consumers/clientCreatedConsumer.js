import { getChannel } from "../../config/rabbitmq.js";
import { sendWelcomeEmail } from "../../config/mailer.js";

export const startClientCreatedConsumer = async () => {
  const channel = getChannel();

  const queue = "email.client.created";

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.bindQueue(queue, "vetcore.events", "client.created");

  console.log(`Waiting for messages in queue: ${queue}`);

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        try {
          const clientData = JSON.parse(msg.content.toString());
          console.log("Received client.created event:", clientData);

          await sendWelcomeEmail(clientData.email, clientData.fullname);

          console.log(`Welcome email successfully send to ${clientData.email}`);

          channel.ack(msg);
        } catch (error) {
          console.error("Error processing client.created event:", error);

          channel.nack(msg, false, true);
        }
      }
    },
    {
      noAck: false,
    }
  );
};
