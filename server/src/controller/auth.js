import User from "../model/User.js";
import client from "../utils/google.js";
import { generateToken } from "../utils/jwttoken.js";
import { hashPassword } from "../utils/bycrpt.js";

const googleSetup = async (req, res, next) => {
  const { token } = req.body;
  try {
    if (!token) {
      return res.status(400).json({
        message: "Token missing",
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        message: "Invalid token",
      });
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
        pasword: hashedpassword,
      });
    }

    const jwtToken = generateToken({
      userId: user._id,
      email: user.email,
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
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { googleSetup };
