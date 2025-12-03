const accountVerificationTemplate = (username, email, otp) => {
  const frontendBase =
    process.env.NODE_ENV === "production"
      ? process.env.FRONT_END_PROD
      : process.env.FRONT_END_DEV;

  const baseUrl = frontendBase || "http://localhost:5173";
  const verificationLink = `${baseUrl}/verify-account?email=${encodeURIComponent(
    email
  )}&otp=${otp}`;

  return {
    subject: "Verify Your eXpress Store Account",
    message: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; border: 1px solid #fce7f3;">

        <!-- HEADER -->
        <div style="background: #ec4899; color: white; padding: 22px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Verify Your Account</h1>
        </div>

        <!-- BODY -->
        <div style="padding: 25px; text-align: center; color: #4b5563;">
          <h2 style="margin-top: 0;">Hi ${username},</h2>

          <p style="font-size: 15px; line-height: 1.6;">
            Thank you for joining 
            <strong style="color: #ec4899;">eXpress Store</strong>!<br>
            Please verify your email address to activate your account.
          </p>

          <!-- BUTTON -->
          <a href="${verificationLink}"
            style="
              display: inline-block;
              margin-top: 18px;
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
            Verify My Account
          </a>

          <p style="margin-top: 28px; font-size: 13px; color: #6b7280;">
            If you didn't create this account, feel free to ignore this email.
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

export default accountVerificationTemplate;
