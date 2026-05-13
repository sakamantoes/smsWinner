import { Router } from "express";
import authMiddleware, {
  validateUserRole,
} from "../middleware/authMiddleware.js";
import {
  getAllUserDeposit,
  getUserWalletBalance,
} from "../controller/user.controller.js";

const router = Router();

router.get("/wallet/balance", authMiddleware, validateUserRole, getUserWalletBalance);

router.get("/wallet/deposits", authMiddleware, validateUserRole, getAllUserDeposit);


export default router;
