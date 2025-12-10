import { getChannel } from "../../config/rabbitmq.js";
import {
  sendAppointmentReminderEmail,
  sendVaccinationReminderEmail,
  sendDewormingReminderEmail,
  sendFollowUpReminderEmail,
} from "../../config/mailer.js";
import axios from "axios";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:3000";

/**
 * Obtiene los datos del cliente desde el servicio de autenticación
 */
const getClientData = async (clientId) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/api/users/${clientId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching client data for clientId ${clientId}:`, error.message);
    return null;
  }
};

/**
 * Obtiene los datos de la mascota desde el servicio de pacientes
 */
const getPetData = async (petId) => {
  try {
    const PATIENTS_SERVICE_URL = process.env.PATIENTS_SERVICE_URL || "http://patients-service:3001";
    const response = await axios.get(`${PATIENTS_SERVICE_URL}/api/patients/${petId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching pet data for petId ${petId}:`, error.message);
    return null;
  }
};

/**
 * Consumer para recordatorios de citas
 */
export const startAppointmentReminderConsumer = async () => {
  const channel = getChannel();
  const queue = "email.reminder.appointment";

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, "vetcore.events", "reminder.appointment");

  console.log(`Waiting for appointment reminder messages in queue: ${queue}`);

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        try {
          const reminderData = JSON.parse(msg.content.toString());
          console.log("Received reminder.appointment event:", reminderData);

          // Obtener datos del cliente y mascota
          const [clientData, petData] = await Promise.all([
            getClientData(reminderData.clientId),
            getPetData(reminderData.petId),
          ]);

          if (!clientData || !petData) {
            throw new Error("Could not fetch client or pet data");
          }

          // Enviar email de recordatorio
          await sendAppointmentReminderEmail(clientData.email, clientData.fullname, {
            date: new Date(reminderData.date).toLocaleDateString("es-ES"),
            time: reminderData.time,
            reason: reminderData.reason,
            petName: petData.petName,
          });

          console.log(`Appointment reminder email sent to ${clientData.email}`);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing reminder.appointment event:", error);
          channel.nack(msg, false, true);
        }
      }
    },
    { noAck: false }
  );
};

/**
 * Consumer para recordatorios de vacunas
 */
export const startVaccinationReminderConsumer = async () => {
  const channel = getChannel();
  const queue = "email.reminder.vaccination";

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, "vetcore.events", "reminder.vaccination");

  console.log(`Waiting for vaccination reminder messages in queue: ${queue}`);

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        try {
          const reminderData = JSON.parse(msg.content.toString());
          console.log("Received reminder.vaccination event:", reminderData);

          // Obtener datos de la mascota para luego obtener el owner (clientId)
          const petData = await getPetData(reminderData.petId);
          if (!petData) {
            throw new Error("Could not fetch pet data");
          }

          const clientData = await getClientData(petData.owner);
          if (!clientData) {
            throw new Error("Could not fetch client data");
          }

          // Enviar email de recordatorio
          await sendVaccinationReminderEmail(clientData.email, clientData.fullname, {
            vaccineName: reminderData.vaccineName,
            nextDose: new Date(reminderData.nextDose).toLocaleDateString("es-ES"),
            petName: petData.petName,
          });

          console.log(`Vaccination reminder email sent to ${clientData.email}`);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing reminder.vaccination event:", error);
          channel.nack(msg, false, true);
        }
      }
    },
    { noAck: false }
  );
};

/**
 * Consumer para recordatorios de desparasitaciones
 */
export const startDewormingReminderConsumer = async () => {
  const channel = getChannel();
  const queue = "email.reminder.deworming";

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, "vetcore.events", "reminder.deworming");

  console.log(`Waiting for deworming reminder messages in queue: ${queue}`);

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        try {
          const reminderData = JSON.parse(msg.content.toString());
          console.log("Received reminder.deworming event:", reminderData);

          // Obtener datos de la mascota para luego obtener el owner (clientId)
          const petData = await getPetData(reminderData.petId);
          if (!petData) {
            throw new Error("Could not fetch pet data");
          }

          const clientData = await getClientData(petData.owner);
          if (!clientData) {
            throw new Error("Could not fetch client data");
          }

          // Enviar email de recordatorio
          await sendDewormingReminderEmail(clientData.email, clientData.fullname, {
            product: reminderData.product,
            parasiteType: reminderData.parasiteType,
            nextDose: new Date(reminderData.nextDose).toLocaleDateString("es-ES"),
            petName: petData.petName,
          });

          console.log(`Deworming reminder email sent to ${clientData.email}`);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing reminder.deworming event:", error);
          channel.nack(msg, false, true);
        }
      }
    },
    { noAck: false }
  );
};

/**
 * Consumer para recordatorios de seguimientos
 */
export const startFollowUpReminderConsumer = async () => {
  const channel = getChannel();
  const queue = "email.reminder.followup";

  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, "vetcore.events", "reminder.followup");

  console.log(`Waiting for follow-up reminder messages in queue: ${queue}`);

  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        try {
          const reminderData = JSON.parse(msg.content.toString());
          console.log("Received reminder.followup event:", reminderData);

          // Obtener datos de la mascota para luego obtener el owner (clientId)
          const petData = await getPetData(reminderData.petId);
          if (!petData) {
            throw new Error("Could not fetch pet data");
          }

          const clientData = await getClientData(petData.owner);
          if (!clientData) {
            throw new Error("Could not fetch client data");
          }

          // Enviar email de recordatorio
          await sendFollowUpReminderEmail(clientData.email, clientData.fullname, {
            nextConsultation: new Date(reminderData.nextConsultation).toLocaleDateString("es-ES"),
            diagnosis: reminderData.diagnosis,
            petName: petData.petName,
          });

          console.log(`Follow-up reminder email sent to ${clientData.email}`);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing reminder.followup event:", error);
          channel.nack(msg, false, true);
        }
      }
    },
    { noAck: false }
  );
};
