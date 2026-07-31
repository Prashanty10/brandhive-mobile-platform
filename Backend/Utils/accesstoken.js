import jwt from "jsonwebtoken";

const generateAccessToken = (userId, email, roles = ["buyer"], activeRole = "buyer") => {
  try {
    const token = jwt.sign(
      {
        userId,
        email,
        roles,
        activeRole,
      },
      process.env.ACCESS_TOKEN_SECRET ,
      {
        expiresIn: "15m",
      },
    );

    return token;
  } catch (error) {
    console.error("Access Token Error:", error.message);
    throw new Error("Failed to generate access token");
  }
};

export default generateAccessToken;
