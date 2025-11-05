import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("Email service is already to send emails");
    return true;
  } catch (error) {
    console.error("Error verifying email configuration:", error.message);
    throw error;
  }
};

export const sendWelcomeEmail = async (to, fullname) => {
  try {
    const mailOptions = {
      from: `"Vetcore Platform" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: "¡Bienvenido a Vetcore!",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a Vetcore</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">¡Bienvenido a Vetcore!</h1>
          </div>

          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #4CAF50;">Hola ${fullname},</h2>

            <p>¡Gracias por unirte a <strong>Vetcore</strong>, la plataforma de gestión veterinaria que cuida de tus mejores amigos!</p>

            <p>Estamos emocionados de tenerte con nosotros. Con Vetcore podrás:</p>

            <ul style="line-height: 2;">
              <li>📋 Gestionar las citas de tus mascotas</li>
              <li>🏥 Acceder al historial médico completo</li>
              <li>💊 Recibir recordatorios de vacunas y tratamientos</li>
              <li>👨‍⚕️ Conectar con veterinarios profesionales</li>
            </ul>

            <p>Tu cuenta ya está activa y lista para usar. Puedes iniciar sesión en cualquier momento para comenzar a gestionar el cuidado de tus mascotas.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
                 style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Ir a Vetcore
              </a>
            </div>

            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>

            <p>¡Que tengas un excelente día!</p>

            <p style="margin-top: 30px;">
              <strong>El equipo de Vetcore</strong><br>
              <small style="color: #666;">Cuidando de tus mascotas con amor y profesionalismo</small>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
          </div>
        </body>
        </html>
      `,
      text: `
¡Bienvenido a Vetcore!

Hola ${fullname},

¡Gracias por unirte a Vetcore, la plataforma de gestión veterinaria que cuida de tus mejores amigos!

Estamos emocionados de tenerte con nosotros. Con Vetcore podrás:

- Gestionar las citas de tus mascotas
- Acceder al historial médico completo
- Recibir recordatorios de vacunas y tratamientos
- Conectar con veterinarios profesionales

Tu cuenta ya está activa y lista para usar. Puedes iniciar sesión en cualquier momento para comenzar a gestionar el cuidado de tus mascotas.

Visita: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.

¡Que tengas un excelente día!

El equipo de Vetcore
Cuidando de tus mascotas con amor y profesionalismo

---
Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email send to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending welcome email to ${to}:`, error.message);
    throw error;
  }
};

export const sendAdminCreatedUserEmail = async (to, fullname, roleName, temporaryPassword) => {
  try {
    const mailOptions = {
      from: `"Vetcore Platform" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: "Tu cuenta en Vetcore ha sido creada",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cuenta creada en Vetcore</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #2196F3; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">¡Tu cuenta ha sido creada!</h1>
          </div>

          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2196F3;">Hola ${fullname},</h2>

            <p>Un administrador ha creado una cuenta para ti en <strong>Vetcore</strong>, la plataforma de gestión veterinaria.</p>

            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #856404;">⚠️ Información importante de seguridad</p>
              <p style="margin: 10px 0 0 0; color: #856404;">Por tu seguridad, deberás cambiar esta contraseña la primera vez que inicies sesión.</p>
            </div>

            <h3 style="color: #2196F3; margin-top: 30px;">Tus credenciales de acceso:</h3>

            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${to}</p>
              <p style="margin: 5px 0;"><strong>Contraseña temporal:</strong> <code style="background-color: #fff; padding: 5px 10px; border-radius: 3px; font-size: 16px; color: #d32f2f;">${temporaryPassword}</code></p>
              <p style="margin: 5px 0;"><strong>Rol asignado:</strong> ${roleName}</p>
            </div>

            <p><strong>¿Qué puedes hacer en Vetcore según tu rol?</strong></p>
            <ul style="line-height: 2;">
              ${roleName === 'admin' ? '<li>👨‍💼 Administrar usuarios y configuración del sistema</li>' : ''}
              ${roleName === 'veterinarian' ? '<li>👨‍⚕️ Gestionar historiales médicos y consultas</li>' : ''}
              ${roleName === 'receptionist' ? '<li>📋 Gestionar citas y registros de pacientes</li>' : ''}
              ${roleName === 'client' ? '<li>🐾 Ver el historial médico de tus mascotas</li>' : ''}
              <li>📧 Actualizar tu información de perfil</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
                 style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Iniciar Sesión
              </a>
            </div>

            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #856404;">🔒 Recomendaciones de seguridad:</p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #856404;">
                <li>No compartas tu contraseña con nadie</li>
                <li>Usa una contraseña segura al cambiarla (mínimo 8 caracteres)</li>
                <li>Cierra sesión cuando termines de usar la plataforma</li>
              </ul>
            </div>

            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar al administrador.</p>

            <p style="margin-top: 30px;">
              <strong>El equipo de Vetcore</strong><br>
              <small style="color: #666;">Cuidando de tus mascotas con amor y profesionalismo</small>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
          </div>
        </body>
        </html>
      `,
      text: `
Tu cuenta en Vetcore ha sido creada

Hola ${fullname},

Un administrador ha creado una cuenta para ti en Vetcore, la plataforma de gestión veterinaria.

⚠️ IMPORTANTE: Por tu seguridad, deberás cambiar esta contraseña la primera vez que inicies sesión.

TUS CREDENCIALES DE ACCESO:
- Email: ${to}
- Contraseña temporal: ${temporaryPassword}
- Rol asignado: ${roleName}

RECOMENDACIONES DE SEGURIDAD:
- No compartas tu contraseña con nadie
- Usa una contraseña segura al cambiarla (mínimo 8 caracteres)
- Cierra sesión cuando termines de usar la plataforma

Visita: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar al administrador.

El equipo de Vetcore
Cuidando de tus mascotas con amor y profesionalismo

---
Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Admin-created user email sent to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending admin-created user email to ${to}:`, error.message);
    throw error;
  }
};

export const sendAppointmentConfirmationEmail = async (to, recipientName, appointmentData, recipientType) => {
  try {
    const isClient = recipientType === "client";
    const { fecha, hora, motivo, petName, clientName, veterinarianName } = appointmentData;

    const mailOptions = {
      from: `"Vetcore Platform" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: isClient ? "Confirmación de cita en Vetcore" : "Nueva cita asignada - Vetcore",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${isClient ? 'Confirmación de cita' : 'Nueva cita asignada'}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: ${isClient ? '#4CAF50' : '#FF9800'}; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">${isClient ? '¡Cita confirmada!' : 'Nueva cita asignada'}</h1>
          </div>

          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: ${isClient ? '#4CAF50' : '#FF9800'};">Hola ${recipientName},</h2>

            <p>${isClient
              ? `Tu cita ha sido <strong>agendada exitosamente</strong> en Vetcore.`
              : `Se te ha asignado una <strong>nueva cita</strong> para atender.`
            }</p>

            <h3 style="color: ${isClient ? '#4CAF50' : '#FF9800'}; margin-top: 30px;">Detalles de la cita:</h3>

            <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${isClient ? '#4CAF50' : '#FF9800'};">
              <p style="margin: 8px 0;"><strong>📅 Fecha:</strong> ${fecha}</p>
              <p style="margin: 8px 0;"><strong>🕒 Hora:</strong> ${hora}</p>
              <p style="margin: 8px 0;"><strong>🐾 Mascota:</strong> ${petName}</p>
              <p style="margin: 8px 0;"><strong>${isClient ? '👨‍⚕️ Veterinario' : '👤 Cliente'}:</strong> ${isClient ? veterinarianName : clientName}</p>
              <p style="margin: 8px 0;"><strong>📋 Motivo:</strong> ${motivo}</p>
            </div>

            ${isClient
              ? `
              <div style="background-color: #e8f5e9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #2e7d32;">✅ Recordatorios importantes:</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #2e7d32;">
                  <li>Llega 10 minutos antes de tu cita</li>
                  <li>Trae el carnet de vacunación de tu mascota</li>
                  <li>Si necesitas cancelar, hazlo con al menos 24 horas de anticipación</li>
                </ul>
              </div>
              `
              : `
              <div style="background-color: #fff3e0; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #e65100;">📌 Información adicional:</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #e65100;">
                  <li>Revisa el historial médico de la mascota antes de la cita</li>
                  <li>Prepara el consultorio con anticipación</li>
                  <li>Confirma que cuentas con el equipo necesario</li>
                </ul>
              </div>
              `
            }

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
                 style="background-color: ${isClient ? '#4CAF50' : '#FF9800'}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Ver en Vetcore
              </a>
            </div>

            <p>Si tienes alguna pregunta o necesitas hacer cambios, no dudes en contactarnos.</p>

            <p style="margin-top: 30px;">
              <strong>El equipo de Vetcore</strong><br>
              <small style="color: #666;">Cuidando de tus mascotas con amor y profesionalismo</small>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
          </div>
        </body>
        </html>
      `,
      text: `
${isClient ? '¡Cita confirmada!' : 'Nueva cita asignada'}

Hola ${recipientName},

${isClient
  ? 'Tu cita ha sido agendada exitosamente en Vetcore.'
  : 'Se te ha asignado una nueva cita para atender.'
}

DETALLES DE LA CITA:
- Fecha: ${fecha}
- Hora: ${hora}
- Mascota: ${petName}
- ${isClient ? 'Veterinario' : 'Cliente'}: ${isClient ? veterinarianName : clientName}
- Motivo: ${motivo}

${isClient
  ? `
RECORDATORIOS IMPORTANTES:
- Llega 10 minutos antes de tu cita
- Trae el carnet de vacunación de tu mascota
- Si necesitas cancelar, hazlo con al menos 24 horas de anticipación
  `
  : `
INFORMACIÓN ADICIONAL:
- Revisa el historial médico de la mascota antes de la cita
- Prepara el consultorio con anticipación
- Confirma que cuentas con el equipo necesario
  `
}

Visita: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

Si tienes alguna pregunta o necesitas hacer cambios, no dudes en contactarnos.

El equipo de Vetcore
Cuidando de tus mascotas con amor y profesionalismo

---
Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Appointment confirmation email sent to ${to} (${recipientType}). Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending appointment confirmation email to ${to}:`, error.message);
    throw error;
  }
};
