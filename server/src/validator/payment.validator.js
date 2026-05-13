import { body, query } from "express-validator";

export const initialiseDepositValidator = [
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .notEmpty()
    .withMessage("Amount is required"),
  body("paymentMethod")
    .isIn(["SQUAD", "ALAT", "MANUAL_TRANSFER"])
    .withMessage("Payment method must be one of: SQUAD, ALAT, MANUAL_TRANSFER")
    .notEmpty(),
  body(),
];

export const callbackUrlValidator = [
  body("referenceId").notEmpty().withMessage("Reference ID is required"),
];

export const paymentStatusValidator = [
  body("referenceId").notEmpty().withMessage("Reference ID is required"),
];

export const manuelPaymentValidator = [
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .notEmpty()
    .withMessage("Amount is required"),
  body("transactionId")
    .isString()
    .notEmpty()
    .withMessage("transactionId is required"),
  body("depositorName")
    .isString()
    .notEmpty()
    .withMessage("deositorName is required"),
];
