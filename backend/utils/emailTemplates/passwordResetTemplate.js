const passwordResetTemplate = (username, otp) => {
  const frontendBase =
    process.env.NODE_ENV === "production"
      ? process.env.FRONT_END_PROD
      : process.env.FRONT_END_DEV; // ✅ fix env variable reference

  const baseUrl = frontendBase || "http://localhost:5173";
  const resetLink = `${baseUrl}/reset-password?email=${encodeURIComponent(
    username
  )}&otp=${otp}`;

  return {
    subject: "Reset Your eXpress Store Password",
    message: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; border: 1px solid #fce7f3;">

        <!-- HEADER -->
        <div style="background: #ec4899; color: white; padding: 22px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Password Reset Request</h1>
        </div>

        <!-- BODY -->
        <div style="padding: 25px; text-align: center; color: #4b5563;">
          <h2 style="margin-top: 0;">Hi ${username},</h2>

          <p style="font-size: 15px; line-height: 1.6;">
            We received a request to reset your password for 
            <strong style="color: #ec4899;">eXpress Store</strong>.
          </p>

          <p style="font-size: 15px; margin-top: 10px;">
            Use the OTP below or click the button to continue:
          </p>

          <!-- OTP BOX -->
          <div style="
            margin: 22px auto;
            font-size: 28px;
            font-weight: bold;
            background: #fce7f3;
            color: #ec4899;
            padding: 14px 28px;
            border-radius: 8px;
            display: inline-block;
            border: 1px solid #f9a8d4;
          ">
            ${otp}
          </div>

          <!-- BUTTON -->
          <a href="${resetLink}"
            style="
              display: inline-block;
              margin-top: 10px;
              padding: 12px 26px;
              background-color: #ec4899;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              transition: background 0.3s ease;
            "
            onmouseover="this.style.backgroundColor='#db2777'"
            onmouseout="this.style.backgroundColor='#ec4899'"
          >
            Reset My Password
          </a>

          <p style="margin-top: 25px; font-size: 13px; color: #6b7280;">
            This OTP expires in 10 minutes.
          </p>
        </div>

        <!-- FOOTER -->
        <div style="background: #fce7f3; text-align: center; padding: 14px; font-size: 12px; color: #ec4899; border-radius: 0 0 10px 10px;">
          © ${new Date().getFullYear()} eXpress Store · All rights reserved.
        </div>

      </div>
    `,
  };
};

export default passwordResetTemplate;
