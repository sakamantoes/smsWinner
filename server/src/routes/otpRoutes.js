// routes/otpRoutes.js
import express from "express";
import {
  buyNumber,
  checkOtpStatus,
  cancelActivation,
  getSmsActivateBalance,
  getAvailableServices,
  getOrderDetails,
} from "../controller/otpController.js";

const router = express.Router();

router.post("/buy-number", buyNumber);
router.get("/status/:orderId", checkOtpStatus);
router.post("/cancel/:orderId", cancelActivation);
router.get("/balance", getSmsActivateBalance);
router.get("/services", getAvailableServices);
router.get("/order/:orderId", getOrderDetails);

export default router;