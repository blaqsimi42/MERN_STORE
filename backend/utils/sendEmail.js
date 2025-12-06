import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, message }) => {
  try {
    // ✅ Skip SMTP on Render (use API directly)
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP not supported on Render; use fallback");
    }

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
    console.log(`📧 Email sent successfully to ${to} via SMTP`);
    console.log(`➡ Message ID: ${info.messageId}`);
  } catch (smtpError) {
    console.error("❌ SMTP failed or skipped:", smtpError.message);

    try {
      // ✅ Fallback to Brevo API
      const brevoResp = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.SMTP_PASS,
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

      const data = await brevoResp.json();

      if (brevoResp.ok) {
        console.log(`📧 Email sent successfully to ${to} via Brevo API`);
      } else {
        console.error("❌ Brevo API failed:", data);
        throw new Error("Email delivery failed via API fallback");
      }
    } catch (apiError) {
      console.error("❌ Email sending completely failed:", apiError.message);
      throw new Error("Email delivery failed");
    }
  }
};

export default sendEmail;
