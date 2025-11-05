import { getChannel } from "../../config/rabbitmq.js";
import { sendAppointmentConfirmationEmail } from "../../config/mailer.js";

export const startAppointmentCreatedConsumer = async () => {
  const channel = getChannel();

  const queue = "email.appointment.created";

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.bindQueue(queue, "vetcore.events", "appointment.created");

  console.log(`Waiting for messages in queue: ${queue}`);

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        try {
          const appointmentData = JSON.parse(msg.content.toString());
          console.log("Received appointment.created event:", appointmentData);

          const {
            clientEmail,
            clientName,
            veterinarianEmail,
            veterinarianName,
            fecha,
            hora,
            motivo,
            petName,
          } = appointmentData;

          // Enviar correo al cliente
          await sendAppointmentConfirmationEmail(
            clientEmail,
            clientName,
            {
              fecha,
              hora,
              motivo,
              petName,
              clientName,
              veterinarianName,
            },
            "client"
          );
          console.log(`Appointment confirmation email sent to client: ${clientEmail}`);

          // Enviar correo al veterinario
          await sendAppointmentConfirmationEmail(
            veterinarianEmail,
            veterinarianName,
            {
              fecha,
              hora,
              motivo,
              petName,
              clientName,
              veterinarianName,
            },
            "veterinarian"
          );
          console.log(`Appointment confirmation email sent to veterinarian: ${veterinarianEmail}`);

          channel.ack(msg);
        } catch (error) {
          console.error("Error processing appointment.created event:", error);

          channel.nack(msg, false, true);
        }
      }
    },
    {
      noAck: false,
    }
  );
};
