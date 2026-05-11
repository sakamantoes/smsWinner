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
  updateMarkup,
} from "../controller/otpController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateAdminRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/buy-number", authMiddleware, buyNumber);
router.get("/status/:orderId", authMiddleware, checkOtpStatus);
router.post("/cancel/:orderId", authMiddleware, cancelActivation);
router.get("/my-balance", authMiddleware, getUserBalance);
router.get("/my-orders", authMiddleware, getOrderHistory);
router.get("/order/:orderId", authMiddleware, getOrderDetails);
router.get("/company-stats", authMiddleware, validateAdminRole, getCompanyStats);
router.get("/sms-balance", authMiddleware, getSmsActivateBalance);
router.get("/available-services", authMiddleware, getAvailableServices);
router.put("/admin-update-markup", authMiddleware,validateAdminRole, updateMarkup);

export default router;