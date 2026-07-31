import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      ...decoded,
      _id: decoded._id || decoded.userId || decoded.id,
      id: decoded._id || decoded.userId || decoded.id,
      userId: decoded._id || decoded.userId || decoded.id,
      roles: decoded.roles || ["buyer"],
      activeRole: decoded.activeRole || "buyer",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.activeRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient role permissions.",
      });
    }
    next();
  };
};

export default authMiddleware;
