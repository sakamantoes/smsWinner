import { verifyToken } from "../utils/jwttoken.js";

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authentication required.",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid or expired token",
    });
  }
};

export default authMiddleware;
