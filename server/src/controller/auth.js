import User from "../model/User.js";
import client from "../utils/google.js";
import { generateToken } from "../utils/jwttoken.js";
import { comparePassword, hashPassword } from "../utils/bycrpt.js";
import { setAuthCookie } from "../utils/setCookie.js";
import { env } from "../config/constant.js";

const googleSetup = async (req, res, next) => {
  const { token } = req.body;
  try {
    if (!token) {
      res.statusCode = 400;
      throw new Error("missing token");
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.google_client_id,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.statusCode = 400;
      throw new Error("invaild token");
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
    setAuthCookie(res, jwtToken);

    res.status(201).json({
      success: true,
      message: "You're Google registration was successful",
    });
  } catch (error) {
    next(error);
  }
};

const getAuthUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

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

const emailSignup = async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    const isUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (isUser) {
      res.statusCode = 400;
      throw new Error("User with this email or username already exists");
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email: normalizedEmail,
      username,
      password: hashedPassword,
    });

    const jwtToken = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, jwtToken);

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    next(error);
  }
};

const emailLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.statusCode = 401;
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.statusCode = 401;
      throw new Error("Invalid Credentials");
    }

    const jwtToken = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    setAuthCookie(res, jwtToken);

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

export { googleSetup, getAuthUser, emailSignup, emailLogin };
