import { Router } from "express";
import {
  priceSettingController,
  getPlatformDeposits,
  getUserWaitingForOtp,
  updateDepositsStatus,
} from "../controller/admin.controller.js";
import authMiddleware, {
  validateAdminRole,
} from "../middleware/authMiddleware.js";
import {
  updateDepositValidator,
  priceSettingSchema,
} from "../validator/admin.validator.js";
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
router.post(
  "/pricing/setting",
  authMiddleware,
  validateAdminRole,
  priceSettingSchema,
  priceSettingController,
);

router.get(
  "/pending/otp",
  authMiddleware,
  validateAdminRole,
  getUserWaitingForOtp,
);
export default router;
