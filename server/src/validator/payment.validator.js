import { body } from "express-validator";

export const initialiseDepositValidator = [
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .notEmpty()
    .withMessage("Amount is required"),
  body("transactionId")
    .isString()
    .withMessage("Transaction ID must be a string")
    .notEmpty()
    .withMessage("Transaction ID is required"),
  body("referenceId")
    .isString()
    .withMessage("Reference ID must be a string")
    .notEmpty()
    .withMessage("Reference ID is required"),
  body("paymentMethod")
    .isString()
    .withMessage("Payment method must be a string")
    .notEmpty()
    .withMessage("Payment method is required"),
];
