import { getChannel } from "../../config/rabbitmq.js";
import { sendAdminCreatedUserEmail } from "../../config/mailer.js";

export const startUserCreatedByAdminConsumer = async () => {
  const channel = getChannel();

  const queue = "email.user.created.by.admin";

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.bindQueue(queue, "vetcore.events", "user.created.by.admin");

  console.log(`Waiting for messages in queue: ${queue}`);

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        try {
          const userData = JSON.parse(msg.content.toString());
          console.log("Received user.created.by.admin event:", userData);

          await sendAdminCreatedUserEmail(
            userData.email,
            userData.fullname,
            userData.roleName,
            userData.temporaryPassword
          );

          console.log(
            `Credentials email successfully sent to ${userData.email}`
          );

          channel.ack(msg);
        } catch (error) {
          console.error(
            "Error processing user.created.by.admin event:",
            error
          );

          channel.nack(msg, false, true);
        }
      }
    },
    {
      noAck: false,
    }
  );
};
