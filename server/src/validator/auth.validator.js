import { body } from "express-validator";

const registerSchema = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const loginSchema = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const googleSchema = [body("token").notEmpty().withMessage("missing token")];

const logSchema = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Invalid price"),

  body("country")
    .notEmpty()
    .withMessage("Country is required"),
];

export { registerSchema, loginSchema, googleSchema, logSchema };
