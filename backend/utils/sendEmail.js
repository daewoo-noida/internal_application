const nodemailer = require("nodemailer");

console.log("Initializing mail transporter...");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});


transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP connection failed:", error);
    } else {
        console.log("✅ SMTP server is ready to take messages");
    }
});

async function sendEmail(to, subject, html) {
    console.log("🔹 sendEmail called with:");
    console.log("   To:", to);
    console.log("   Subject:", subject);

    try {
        const info = await transporter.sendMail({
            from: `"Daewoo EBG Support" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        // console.log("✅ Email sent successfully");
        // console.log("   Message ID:", info.messageId);
        // console.log("   Response:", info.response);
    } catch (error) {
        console.error("❌ Error while sending email:");
        console.error("   Message:", error.message);
        if (error.response) console.error("   Response:", error.response);
        if (error.code) console.error("   Code:", error.code);
    }
}

module.exports = sendEmail;
