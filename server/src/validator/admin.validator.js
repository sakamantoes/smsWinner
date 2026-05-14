import { body, check } from "express-validator";

export const updateDepositValidator = [
  body("status")
    .isIn(["pending", "failed", "success"])
    .withMessage("should be success, pending or either failed")
    .notEmpty(),
  ,
  check("id").isString().withMessage("id is missing in params").notEmpty(),
];
