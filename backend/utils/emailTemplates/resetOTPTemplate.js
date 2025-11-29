const resetOtpTemplate = (username, otp) => {
  return {
    subject: "Your eXpress Store Verification OTP",
    message: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; border: 1px solid #fce7f3;">

        <!-- HEADER -->
        <div style="background: #ec4899; color: white; padding: 22px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">New Verification OTP</h1>
        </div>

        <!-- BODY -->
        <div style="padding: 25px; text-align: center; color: #4b5563;">
          <h2 style="margin-top: 0;">Hi ${username},</h2>

          <p style="font-size: 15px; line-height: 1.6;">
            Your new OTP for verifying your 
            <strong style="color: #ec4899;">eXpress Store</strong> account is:
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

          <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">
            This OTP will expire in 10 minutes.
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

export default resetOtpTemplate;
