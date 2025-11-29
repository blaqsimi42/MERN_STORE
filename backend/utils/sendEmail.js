import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
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
    console.log(`📧 Email sent successfully to ${to}`);
    console.log(`➡ Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email delivery failed");
  }
};

export default sendEmail;
