// routes/otpRoutes.js (Testing version - remove in production)
import express from "express";
import {
  buyNumber,
  checkOtpStatus,
  cancelActivation,
  getUserBalance,
  getCompanyStats,
  getOrderHistory,
  getSmsActivateBalance,
  getAvailableServices,
  getOrderDetails,
} from "../controller/otpController.js";

const router = express.Router();

// Routes
router.post("/buy-number", buyNumber);
router.get("/status/:orderId", checkOtpStatus);
router.post("/cancel/:orderId", cancelActivation);
router.get("/my-balance", getUserBalance);
router.get("/my-orders", getOrderHistory);
router.get("/order/:orderId", getOrderDetails);
router.get("/company-stats", getCompanyStats);
router.get("/sms-balance", getSmsActivateBalance);
router.get("/available-services", getAvailableServices);

export default router;