import jwt from "jsonwebtoken";

const generateRefreshToken = (userId, email, roles = ["buyer"], activeRole = "buyer") => {
  try {
    const token = jwt.sign(
      {
        userId,
        email,
        roles,
        activeRole,
      },
      process.env.REFRESH_TOKEN_SECRET
    );

    return token;
  } catch (error) {
    console.error("Refresh Token Error:", error.message);
    throw new Error("Failed to generate rfresh token");
  }
};


export default generateRefreshToken;
