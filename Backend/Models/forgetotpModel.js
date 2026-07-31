import mongoose from "mongoose";

const ForgetOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    otp: {
      type: String,
      required: [true, "OTP is required"],
      minlength: 6,
      maxlength: 6,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0, 
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ForgetOtpModel = mongoose.model("ForgetOtp", ForgetOtpSchema);

export default ForgetOtpModel;