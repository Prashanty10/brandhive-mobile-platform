import User from "../Models/userModel.js";
import SellerProfile from "../Models/sellerProfileModel.js";
import jwt from "jsonwebtoken";
import ForgetOtpModel from "../Models/ForgetotpModel.js";
import VerifyOtpModel from "../Models/VerifyotpModel.js";

import { generateForgetOtp, generateVerifyOtp } from "../Utils/otp.js";
import verifyemailotp from "../Utils/emailverification.js";
import forgetemail from "../Utils/forgetemail.js";

import generateAccessToken from "../Utils/accesstoken.js";
import generateRefreshToken from "../Utils/refreshtoken.js";

import bcrypt from "bcrypt";
import uploadToCloudinary from "../Utils/cloudinary.js";

export const LoginHandler = async (req, res) => {
  try {
    const { email, password , role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not registered",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!existingUser.isVerified) {
      await VerifyOtpModel.deleteMany({ email });

      const otp = generateVerifyOtp();

      console.log(`otp verification code is : ${otp}`);

      await verifyemailotp(email, otp);

      await VerifyOtpModel.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      return res.status(403).json({
        success: false,
        message: "Email not verified. A new OTP has been sent.",
      });
    }

    if (req.body.role && ["buyer", "seller"].includes(String(req.body.role).toLowerCase())) {
      const requestedRole = String(req.body.role).toLowerCase();
      if (existingUser.roles.includes(requestedRole)) {
        existingUser.activeRole = requestedRole;
      }
    }

    const accessToken = generateAccessToken(
      existingUser._id,
      existingUser.email,
      existingUser.roles,
      existingUser.activeRole
    );

    const refreshToken = generateRefreshToken(
      existingUser._id,
      existingUser.email,
      existingUser.roles,
      existingUser.activeRole
    );

    existingUser.refreshToken = refreshToken;

    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      accessToken,
      refreshToken,
      isVerified: existingUser.isVerified,
      isProfileCompleted: existingUser.isProfileCompleted,
      user: {
        id: existingUser._id,
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        roles: existingUser.roles,
        activeRole: existingUser.activeRole,
        isVerified: existingUser.isVerified,
        isProfileCompleted: existingUser.isProfileCompleted,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        profileImage: existingUser.profileImage,
        city: existingUser.city,
        state: existingUser.state,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const RegisterHandler = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedRole =
      typeof role === "string" ? role.toLowerCase() : "buyer";

    if (!["buyer", "seller"].includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.roles.includes(normalizedRole)) {
        const roleLabel =
          normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
        return res.status(409).json({
          success: false,
          message: `${roleLabel} account already exists. Please login instead.`,
        });
      }

      existingUser.roles.push(normalizedRole);
      existingUser.activeRole = normalizedRole;

      if (normalizedRole === "seller") {
        const existingProfile = await SellerProfile.findOne({
          userId: existingUser._id,
        });
        if (!existingProfile) {
          await SellerProfile.create({ userId: existingUser._id });
        }
      }

      if (existingUser.isVerified) {
        const accessToken = generateAccessToken(
          existingUser._id,
          existingUser.email,
          existingUser.roles,
          existingUser.activeRole
        );

        const refreshToken = generateRefreshToken(
          existingUser._id,
          existingUser.email,
          existingUser.roles,
          existingUser.activeRole
        );

        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        return res.status(200).json({
          success: true,
          message: `${normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)} role added to account successfully.`,
          accessToken,
          refreshToken,
          isVerified: true,
          isProfileCompleted: existingUser.isProfileCompleted,
          user: {
            id: existingUser._id,
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            roles: existingUser.roles,
            activeRole: existingUser.activeRole,
            isVerified: true,
            isProfileCompleted: existingUser.isProfileCompleted,
          },
        });
      }

      await existingUser.save();

      await VerifyOtpModel.deleteMany({ email });
      const otp = generateVerifyOtp();
      await verifyemailotp(email, otp);
      await VerifyOtpModel.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      return res.status(200).json({
        success: true,
        message: `${normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)} role added. Please verify OTP sent to your email.`,
        isVerified: false,
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          roles: existingUser.roles,
          activeRole: existingUser.activeRole,
          isVerified: false,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = await User.create({
      username,
      email,
      password: hashedPassword,
      roles: [normalizedRole],
      activeRole: normalizedRole,
    });

    if (normalizedRole === "seller") {
      await SellerProfile.create({ userId: newuser._id });
    }

    await VerifyOtpModel.deleteMany({ email });

    const otp = generateVerifyOtp();

    await verifyemailotp(email, otp);

    console.log(`otp verification code is : ${otp}`);
    await VerifyOtpModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email",
      user: {
        id: newuser._id,
        username: newuser.username,
        email: newuser.email,
        roles: newuser.roles,
        activeRole: newuser.activeRole,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const cleanOtp = typeof otp === "string" || typeof otp === "number" ? String(otp).trim() : "";

    const otpData = await VerifyOtpModel.findOne({ email: normalizedEmail });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (String(otpData.otp).trim() !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpData.expiresAt < new Date()) {
      await VerifyOtpModel.deleteMany({ email: normalizedEmail });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    const userexist = await User.findOne({ email: normalizedEmail });

    if (!userexist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    userexist.isVerified = true;

    const accessToken = generateAccessToken(
      userexist._id,
      userexist.email,
      userexist.roles,
      userexist.activeRole
    );

    const refreshToken = generateRefreshToken(
      userexist._id,
      userexist.email,
      userexist.roles,
      userexist.activeRole
    );

    userexist.refreshToken = refreshToken;

    await userexist.save();

    await VerifyOtpModel.deleteMany({ email: normalizedEmail });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      accessToken,
      refreshToken,
      user: {
        id: userexist._id,
        username: userexist.username,
        email: userexist.email,
        roles: userexist.roles,
        activeRole: userexist.activeRole,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const ProfileHandler = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, mobile, phoneNumber, city, state, bio, profileImage, location } =
      req.body;

    let imageUrl = profileImage || "";

    if (
      profileImage &&
      typeof profileImage === "string" &&
      profileImage.startsWith("data:image")
    ) {
      const uploadedImage = await uploadToCloudinary(
        profileImage,
        "brandhive/users",
      );
      imageUrl = uploadedImage.secure_url;
    }

    const updateFields = {
      firstName,
      lastName,
      mobileNumber: mobileNumber || mobile || phoneNumber || "",
      city,
      state,
      bio,
      profileImage: imageUrl,
      isProfileCompleted: true,
    };

    if (location) {
      updateFields.location = location;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const ForgetEmailHandler = async (req, res) => {
  try {
    const { email } = req.body;

    await ForgetOtpModel.deleteMany({ email });

    const otp = generateForgetOtp();

    console.log(`forget password otp code is : ${otp}`);
    await forgetemail(email, otp);

    await ForgetOtpModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email please verifyy it ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyforgetpasswordHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const dataexist = await ForgetOtpModel.findOne({ email });

    if (!dataexist) {
      return res.status(404).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
    }

    if (dataexist.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (dataexist.expiresAt < new Date()) {
      await ForgetOtpModel.deleteOne({ email });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    await ForgetOtpModel.deleteOne({ email });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = generateAccessToken(
      user._id,
      user.email,
      user.roles,
      user.activeRole
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const NewpasswordHandler = async (req, res) => {
  try {
    const { password } = req.body;

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: hashpassword,
      },
      {
        returnDocument: "after",
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const LogOutHandler = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        refreshToken: null,
      },
      {
        returnDocument: "after",
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const GetCurrentUserHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const RefreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const userId =
      decoded._id ||
      decoded.userId ||
      decoded.id ||
      (decoded.user && (decoded.user._id || decoded.user.id));

    const user = await User.findById(userId).select("+refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(
      user._id,
      user.email,
      user.roles,
      user.activeRole
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    console.error("Refresh Token Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const SwitchRoleHandler = async (req, res) => {
  try {
    const { role } = req.body;
    const normalizedRole = typeof role === "string" ? role.toLowerCase() : "";

    if (!["buyer", "seller"].includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.roles.includes(normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: `Account does not have ${normalizedRole} role`,
      });
    }

    user.activeRole = normalizedRole;
    await user.save();

    const accessToken = generateAccessToken(
      user._id,
      user.email,
      user.roles,
      user.activeRole
    );

    return res.status(200).json({
      success: true,
      message: `Switched active role to ${normalizedRole}`,
      accessToken,
      activeRole: user.activeRole,
      roles: user.roles,
    });
  } catch (error) {
    console.error("Switch Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
