import { verifyToken } from "../utils/jwttoken.js";
import User from "../model/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.smsWinnerToken;

    if (!token) {
      const error = new Error("No token provided. Authentication required")
      error.statusCode = 401 
      throw error;
    }

    // Verify token
    const decoded = verifyToken(token);

    // if a user of our platform
    const findUser = await User.findOne({
      email: decoded.email
    })

    if(!findUser){
      const error = new Error("unauthorized")
      error.statusCode = 400 
      throw error;
    }

    // Attach user info to request
    req.user = findUser;
    next();
  } catch (error) {
    console.log("auth middleware error:", error)
    next(error)
  }
};

export default authMiddleware;
