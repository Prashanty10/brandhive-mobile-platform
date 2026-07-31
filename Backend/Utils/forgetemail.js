import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      pool: true,
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
};

const forgetemail = async (email  , otp) => {
  try {
    const tranporter = getTransporter();

    const mail = {
      from: process.env.EMAIL,
      to: email,
      subject: "BrandHive Password Reset Code",
      html: `

<h2 style="margin-top:0;color:#111827;">
  Reset Your Password
</h2>

<p style="color:#4b5563;line-height:1.7;">
  Hello,
</p>

<p style="color:#4b5563;line-height:1.7;">
  We received a request to reset the password for your BrandHive account. Use the verification code below to complete the password reset process.
</p>

<!-- OTP Box -->
<div style="
  background:#f9fafb;
  border:2px dashed #000000;
  border-radius:12px;
  padding:20px;
  text-align:center;
  margin:30px 0;
">
  <p style="margin:0;color:#6b7280;font-size:14px;">
    YOUR OTP CODE
  </p>

  <h1 style="
    margin:10px 0 0;
    letter-spacing:8px;
    color:#000000;
    font-size:36px;
  ">
    ${otp}
  </h1>
</div>

<p style="color:#ef4444;font-weight:600;">
  This OTP will expire in 5 minutes.
</p>

<p style="color:#4b5563;line-height:1.7;">
  If you did not request a password reset, please ignore this email.
</p>`,
    };

    const info = await tranporter.sendMail(mail);

    console.log("Email sent:", info.messageId);
    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Email Error:", error.message);
    console.log(`\n==================================================`);
    console.log(`[DEVELOPMENT ONLY] Generated OTP for ${email}: ${otp}`);
    console.log(`==================================================\n`);
    return false;
  }
};

export default forgetemail;