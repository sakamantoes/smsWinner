import { Router } from "express";
import {
  getPlatformDeposits,
  updateDepositsStatus,
} from "../controller/admin.controller.js";
import authMiddleware, {
  validateAdminRole,
} from "../middleware/authMiddleware.js";
import { updateDepositValidator } from "../validator/admin.validator.js";
import { validateData } from "../validator/validator.js";

const router = Router();

router.post("/deposit", authMiddleware, validateAdminRole, getPlatformDeposits);

router.patch(
  "/deposit/:id",
  authMiddleware,
  validateAdminRole,
  updateDepositValidator,
  validateData,
  updateDepositsStatus,
);


export default router