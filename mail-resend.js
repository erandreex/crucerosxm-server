const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.MAILAPI || "");

async function sendEmail({ from, to, subject, html }) {
    try {
        const response = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });
        console.log("Email sent:", response);
        return response;
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
}

function generarContenidoCorreo({ nombre, telefono, correo, fechasalida, cantpersonas, motivoviaje }) {
    const text = `
        Nombre: ${nombre}
        Teléfono: ${telefono}
        Correo: ${correo}
        Fecha de salida: ${fechasalida || "No especificada"}
        Cantidad de personas: ${cantpersonas}
        Motivo del viaje: ${motivoviaje}
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #ccc; padding-bottom: 8px;">🛳️ Detalles de la solicitud de viaje</h2>

        <p style="margin: 10px 0;"><strong>👤 Nombre:</strong> ${nombre}</p>
        <p style="margin: 10px 0;"><strong>📞 Teléfono:</strong> ${telefono}</p>
        <p style="margin: 10px 0;"><strong>📧 Correo:</strong> ${correo}</p>
        <p style="margin: 10px 0;"><strong>📅 Fecha de salida:</strong> ${fechasalida}</p>
        <p style="margin: 10px 0;"><strong>👥 Cantidad de personas:</strong> ${cantpersonas}</p>
        <p style="margin: 10px 0;"><strong>🎯 Motivo del viaje:</strong> ${motivoviaje}</p>

        <p style="margin-top: 30px; font-size: 0.9em; color: #888;">Este mensaje fue enviado desde crucerosporelmundo.com.</p>
    </div>
    `;

    return { text, html };
}

function generarSubscripcion({ correo }) {
    const text = `
        Correo: ${correo}
    `;

    const html = `
        <h2>Quiero subscribirme: </h2>
        <p><strong>Correo:</strong> ${correo}</p>
    `;

    return { text, html };
}

module.exports = { generarContenidoCorreo, generarSubscripcion, sendEmail };
