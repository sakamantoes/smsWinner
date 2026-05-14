import { Router } from "express";
import {
  activateUser,
  deactivateUser,
  emailLogin,
  emailSignup,
  getAllUser,
  getAuthUser,
  googleSetup,
  updatePassword,
  updateUsername,
} from "../controller/auth.js";
import authMiddleware, { validateAdminRole } from "../middleware/authMiddleware.js";
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
router.get("/allUsers", authMiddleware, validateAdminRole, getAllUser)
router.put("/activate/:id", authMiddleware, validateAdminRole, activateUser);
router.put("/deactivate/:id", authMiddleware, validateAdminRole, deactivateUser);
router.put("/update-username", authMiddleware, updateUsername)
router.put("/update-password", authMiddleware, updatePassword)

export default router;
