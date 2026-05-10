import { Router } from "express";
import { validateData } from "../validator/validator.js";
import { initialiseDeposit } from "../controller/payment.js";
import { initialiseDepositValidator } from "../validator/payment.validator.js";

const router = Router();

router.post(
  "/initialize-deposit",
  initialiseDepositValidator,
  validateData,
  initialiseDeposit,
);

export default router;
