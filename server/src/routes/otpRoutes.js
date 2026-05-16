// routes/otpRoutes.js (Testing version - remove in production)
import express from "express";
import {
  buyNumber,
  checkOtpStatus,
  cancelActivation,
  getCompanyStats,
  getOrderHistory,
  getSmsActivateBalance,
  getAvailableServices,
  getOrderDetails,
  updateMarkup,
  nodeOtpWebhook,
  smsActivateWebhook,
  getSmsBowerCountries,
  getSmsBowerBalance,
} from "../controller/otpController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateAdminRole } from "../middleware/authMiddleware.js";

const router = express.Router();

//user Routes
router.post("/buy-number", authMiddleware, buyNumber);
router.get("/status/:orderId", authMiddleware, checkOtpStatus);
router.post("/cancel/:orderId", authMiddleware, cancelActivation);
router.get("/my-orders", authMiddleware, getOrderHistory);
router.get("/order/:orderId", authMiddleware, getOrderDetails);
router.get("/available-services", authMiddleware, getAvailableServices);
router.get("/countrys", authMiddleware, getSmsBowerCountries);

// admin routes
router.get("/company-stats", authMiddleware, validateAdminRole, getCompanyStats);
router.get("/sms-balance", authMiddleware, validateAdminRole, getSmsBowerBalance);
router.get("/available-services", authMiddleware, validateAdminRole, getAvailableServices);
router.put("/admin-update-markup", authMiddleware,validateAdminRole, updateMarkup);

//webhook route
router.post("/webhook/nodeotp", nodeOtpWebhook);
router.post("/webhook/smsactivate", smsActivateWebhook);

export default router;