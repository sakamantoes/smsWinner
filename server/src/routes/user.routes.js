import { Router } from "express";
import authMiddleware, {
  validateUserRole,
} from "../middleware/authMiddleware.js";
import { getUserWalletBalance } from "../controller/user.controller.js";

const router = Router();

router.get("/wallet", authMiddleware, validateUserRole, getUserWalletBalance);

export default router;
