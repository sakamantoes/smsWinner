import User from "../model/User.js";
import client from "../utils/google.js";
import { generateToken } from "../utils/jwttoken.js";
import { hashPassword } from "../utils/bycrpt.js";

const googleSetup = async (req, res, next) => {
  const { token } = req.body;
  try {
    if (!token) {
      const error = new Error("missing token");
      error.statusCode = 400;
      throw error;
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      const error = new Error("invaild token");
      error.statusCode = 400;
      throw error;
    }

    const { email, name, sub } = payload;

    const hashedpassword = await hashPassword(sub);

    let user = await User.findOne({
      email,
    });

    // Create user if doesn't exist
    if (!user) {
      user = await User.create({
        email,
        username: name,
        password: hashedpassword,
      });
    }

    const jwtToken = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    // Set token to cookie header
    res.cookie("smsWinnerToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "You're Google registration was successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAuthUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      res.statusCode = 404;
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { googleSetup, getAuthUser };
