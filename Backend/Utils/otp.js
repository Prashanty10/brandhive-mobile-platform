import crypto from "crypto";

export const generateForgetOtp = () => {
  try {
    return crypto.randomInt(100000, 1000000).toString();
  } catch (error) {
    console.error("OTP Generation Error:", error.message);
    throw new Error("Failed to generate forget OTP");
  }
};

export const generateVerifyOtp = () => {
  try {
    return crypto.randomInt(100000, 1000000).toString();
  } catch (error) {
    console.error("OTP Generation Error:", error.message);
    throw new Error("Failed to generate verify OTP");
  }
};

export default { generateForgetOtp, generateVerifyOtp };
