const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { generarContenidoCorreo, sendEmail, generarSubscripcion } = require("./mail-resend.js");

const app = express();

const PORT = process.env.PORT || 3000;
const ALLOWEDORIGIN = process.env.ALLOWEDORIGIN || "*";

// Middleware
app.use(cors());
app.use(express.json());
app.options(
    "*",
    cors({
        origin: ALLOWEDORIGIN,
    }),
);

app.get("/", (req, res) => {
    res.status(200).send("Server is running");
});

app.post("/form", async (req, res) => {
    const { nombre, telefono, fechasalida, cantpersonas, motivoviaje } = req.body;

    let { correo } = req.body;

    if (!nombre || !telefono || !correo || !cantpersonas || !motivoviaje) {
        return res.status(400).json({ error: "campos requeridos!" });
    }

    const { text, html } = generarContenidoCorreo({ nombre, telefono, correo, fechasalida, cantpersonas, motivoviaje });

    const getMailToArray = () => {
        const mailTo = process.env.MAILTO || "";
        return mailTo
            .split(",")
            .map((email) => email.replace(/\s+/g, ""))
            .filter((email) => email);
    };

    const formatEmailAddress = (email) => {
        const cleanEmail = email.replace(/\s+/g, "");
        const name = "Cruceros por el mundo";
        return `${name} <${cleanEmail}>`;
    };

    const msg = {
        to: getMailToArray(),
        from: formatEmailAddress(process.env.MAILFROM || ""),
        subject: "Formulario de contacto",
        text,
        html,
    };

    try {
        await sendEmail(msg);
        res.json({ success: true, message: "send email" });
    } catch (error) {
        console.error("Error sending email:", error.message);
        if (error.response) {
            console.error("Error details:", error.response.body);
        }
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.post("/subscribe", async (req, res) => {
    const { correo } = req.body;
    if (!correo) {
        return res.status(400).json({ error: "campos requeridos!" });
    }

    const { text, html } = generarSubscripcion({ correo });

    const getMailToArray = () => {
        const mailTo = process.env.MAILTO || "";
        return mailTo
            .split(",")
            .map((email) => email.replace(/\s+/g, ""))
            .filter((email) => email);
    };

    const formatEmailAddress = (email) => {
        const cleanEmail = email.replace(/\s+/g, "");
        const name = "Cruceros por el mundo";
        return `${name} <${cleanEmail}>`;
    };

    const msg = {
        to: getMailToArray(),
        from: formatEmailAddress(process.env.MAILFROM || ""),
        subject: "Solicitud de subscripción",
        text,
        html,
    };

    try {
        await sendEmail(msg);
        res.json({ success: true, message: "send email" });
    } catch (error) {
        console.error("Error sending email:", error.message);
        if (error.response) {
            console.error("Error details:", error.response.body);
        }
        res.status(500).json({ error: "Failed to send email" });
    }
});

// Iniciar servidor
app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup");
    console.log("Server listening on Port", PORT);
});
