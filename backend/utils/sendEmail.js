import nodemailer from "nodemailer";
import fetch from "node-fetch"; // Node 18+ needs this for API calls

const sendEmail = async ({ to, subject, message }) => {
  if (process.env.NODE_ENV !== "production") {
    // 💻 Dev mode: use SMTP
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: { rejectUnauthorized: false },
      });

      const mailOptions = {
        from: `"${process.env.FROM_NAME || "eXpress_Store"}" <${
          process.env.FROM_EMAIL
        }>`,
        to,
        subject,
        html: message,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 Email sent successfully to ${to} via SMTP`);
      console.log(`➡ Message ID: ${info.messageId}`);
      return;
    } catch (smtpError) {
      console.error("❌ SMTP failed:", smtpError.message);
      // fallback to API if needed
    }
  }

  //  Render: use Brevo API
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY, // new API key variable
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

    if (!response.ok) {
      console.error("❌ Brevo API failed:", data);
      throw new Error("Email delivery failed via API");
    }

    console.log(`📧 Email sent successfully to ${to} via Brevo API`);
  } catch (apiError) {
    console.error("❌ Email sending completely failed:", apiError.message);
    throw new Error("Email delivery failed");
  }
};

export default sendEmail;
