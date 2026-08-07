import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} from "../controllers/notificationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// User Notifications
// ===============================

// Get all notifications
router.get("/", protect, getNotifications);

// Get unread notification count
router.get("/unread-count", protect, getUnreadCount);

// Mark all notifications as read
router.put("/read-all", protect, markAllAsRead);

// Mark single notification as read
router.put("/:id/read", protect, markAsRead);

// Delete notification
router.delete("/:id", protect, deleteNotification);

// ===============================
// Admin Only
// ===============================

// Create notification manually
router.post(
  "/",
  protect,
  authorize("admin"),
  createNotification
);

export default router;