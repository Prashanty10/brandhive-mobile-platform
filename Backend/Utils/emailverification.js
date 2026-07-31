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

const verifyemailotp = async (email, otp) => {
  try {
    const transporterInstance = getTransporter();

    const sendemail = {
      from: process.env.EMAIL,
      to: email,
      subject: "BrandHive Verification Code",
      html: `

<h2 style="margin-top:0;color:#111827;">
  Verify Your Email Address
</h2>

<p style="color:#4b5563;line-height:1.7;">
  Hello,
</p>

<p style="color:#4b5563;line-height:1.7;">
  Thank you for choosing BrandHive. Use the verification code below to complete your email verification process.
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
  If you did not request this verification, please ignore this email.
</p>`,
    };

    const info = await transporterInstance.sendMail(sendemail);

    console.log("Email send successfully", info.messageId);
  } catch (error) {
    console.error("Email Error:", error.message);
    console.log(`\n==================================================`);
    console.log(`[DEVELOPMENT ONLY] Generated OTP for ${email}: ${otp}`);
    console.log(`==================================================\n`);
    return false;
  }
};

export default verifyemailotp;
