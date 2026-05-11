import { Router } from "express";
import { validateData } from "../validator/validator.js";
import {
  initialiseDeposit,
  callbackUrlHandler,
  getPaymentStatus,
  webhookHandler,
} from "../controller/payment.js";
import {
  initialiseDepositValidator,
  callbackUrlValidator,
  paymentStatusValidator,
} from "../validator/payment.validator.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateUserRole } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/squad/initialize-deposit",
  authMiddleware,
  validateUserRole,
  initialiseDepositValidator,
  validateData,
  initialiseDeposit,
);

router.post(
  "/callback",
  callbackUrlValidator,
  validateData,
  callbackUrlHandler,
);

router.get(
  "/status",
  paymentStatusValidator,
  validateData,
  getPaymentStatus,
);

router.post("/webhook", webhookHandler);

export default router;
