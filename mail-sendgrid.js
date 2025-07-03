const sgMail = require("@sendgrid/mail");
require("dotenv").config();

async function sendEmail(msg) {
    try {
        sgMail.setApiKey(process.env.MAILAPI || "");
        sgMail.setTimeout(3000);
        await sgMail.send(msg);
        console.log("Email sent sucesfully");
    } catch (error) {
        console.error("Error sending email:", error.message);
        if (error.response) {
            console.error("Error details:", error.response.body);
        }
    }
}

function generarContenidoCorreo({ nombre, telefono, correo, fechasalida, cantpersonas, motivoviaje }) {
    const text = `
        Nombre: ${nombre}
        Teléfono: ${telefono}
        Correo: ${correo}
        Fecha de salida: ${fechasalida}
        Cantidad de personas: ${cantpersonas}
        Motivo del viaje: ${motivoviaje}
    `;

    const html = `
        <h2>Detalles de la solicitud de viaje</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Fecha de salida:</strong> ${fechasalida}</p>
        <p><strong>Cantidad de personas:</strong> ${cantpersonas}</p>
        <p><strong>Motivo del viaje:</strong> ${motivoviaje}</p>
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
