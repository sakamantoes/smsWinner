import { Router } from "express";
import {
  emailLogin,
  emailSignup,
  getAuthUser,
  googleSetup,
} from "../controller/auth.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateData } from "../validator/validator.js";
import {
  googleSchema,
  loginSchema,
  registerSchema,
} from "../validator/auth.validator.js";

const router = Router();

router.post("/signup", registerSchema, validateData, emailSignup);
router.post("/login", loginSchema, validateData, emailLogin);
router.post("/google", googleSchema, validateData, googleSetup);
router.get("/me", authMiddleware, getAuthUser);

export default router;
