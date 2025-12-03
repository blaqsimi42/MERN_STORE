import nodemailer from "nodemailer";
import fetch from "node-fetch"; // built-in in Node 18+, else install node-fetch

const sendEmail = async ({ to, subject, message }) => {
  // --- Helper for logging with clarity ---
  const logSuccess = (method) =>
    console.log(`📧 Email sent successfully to ${to} via ${method}`);
  const logFailure = (method, error) =>
    console.error(`❌ ${method} failed:`, error.message || error);

  try {
    // --- Primary: SMTP ---
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Miggle Technologies"}" <${
        process.env.FROM_EMAIL
      }>`,
      to,
      subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    logSuccess("SMTP");
    console.log("➡ Message ID:", info.messageId);
  } catch (smtpError) {
    logFailure("SMTP", smtpError);

    try {
      // --- Fallback: Brevo API ---
      const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: process.env.FROM_NAME,
            email: process.env.FROM_EMAIL,
          },
          to: [{ email: to }],
          subject,
          htmlContent: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        logSuccess("Brevo API");
      } else {
        logFailure("Brevo API", data);
        throw new Error("Email delivery failed via API fallback");
      }
    } catch (apiError) {
      logFailure("Email completely", apiError);
      throw new Error("Email delivery failed");
    }
  }
};

export default sendEmail;
