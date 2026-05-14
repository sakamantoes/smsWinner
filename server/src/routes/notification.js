// routes/notificationRoutes.js
import express from "express";
import { authenticateUser } from "../middleware/auth.js"; // Adjust path as needed
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controller/notificationController.js";
import { validateUserRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications for the authenticated user
router.get("/", authMiddleware, validateUserRole, getUserNotifications);

// Get unread notification count
router.get("/unread/count", authMiddleware, validateUserRole, getUnreadCount);

// Mark all notifications as read
router.put("/mark-all-read", authMiddleware, validateUserRole, markAllAsRead);

// Mark a specific notification as read
router.put(
  "/:notificationId/read",
  authMiddleware,
  validateUserRole,
  markAsRead,
);

// Delete a specific notification
router.delete(
  "/:notificationId",
  authMiddleware,
  validateUserRole,
  deleteNotification,
);

export default router;
