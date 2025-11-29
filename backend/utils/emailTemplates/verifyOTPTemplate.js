const verifyOtpTemplate = (username) => {
  return {
    subject: "Password Reset Successful!",
    message: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; border: 1px solid #fce7f3;">

        <!-- HEADER -->
        <div style="background: #ec4899; color: white; padding: 22px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Password Reset Successful</h1>
        </div>

        <!-- BODY -->
        <div style="padding: 25px; text-align: center; color: #4b5563;">
          <h2 style="margin-top: 0;">Hi ${username},</h2>

          <p style="font-size: 15px; line-height: 1.6;">
            Your password has been successfully updated.<br>
            You can now log in securely to your account.
          </p>

          <!-- BUTTON -->
          <a href="https://yourexpressstore.com/login"
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
            Go to Login
          </a>

        </div>

        <!-- FOOTER -->
        <div style="background: #fce7f3; text-align: center; padding: 14px; font-size: 12px; color: #ec4899; border-radius: 0 0 10px 10px;">
          © ${new Date().getFullYear()} eXpress Store · All rights reserved.
        </div>

      </div>
    `,
  };
};

export default verifyOtpTemplate;
