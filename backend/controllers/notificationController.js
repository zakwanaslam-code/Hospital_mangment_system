import Notification from "../models/Notification.js";

// ==========================================
// @desc    Get Logged-in User Notifications
// @route   GET /api/notifications
// @access  Private
// ==========================================
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.user._id,
    })
      .populate("sender", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// @desc    Get Unread Notification Count
// @route   GET /api/notifications/unread-count
// @access  Private
// ==========================================
export const getUnreadCount = async (req, res) => {
  try {
    const unread = await Notification.countDocuments({
      receiver: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unread,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// @desc    Mark Notification As Read
// @route   PUT /api/notifications/:id/read
// @access  Private
// ==========================================
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      receiver: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// @desc    Mark All Notifications As Read
// @route   PUT /api/notifications/read-all
// @access  Private
// ==========================================
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        receiver: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// @desc    Delete Notification
// @route   DELETE /api/notifications/:id
// @access  Private
// ==========================================
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      receiver: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// @desc    Create Notification
// @route   POST /api/notifications
// @access  Private (Admin)
// ==========================================
export const createNotification = async (req, res) => {
  try {
    const { receiver, title, message, type, link } = req.body;

    const notification = await Notification.create({
      receiver,
      sender: req.user._id,
      title,
      message,
      type,
      link,
    });

    const populated = await notification.populate("sender", "name email role");

    // Real-time push — sirf us specific user ko jiske liye ye notification hai
    if (req.io) {
      req.io.to(receiver.toString()).emit("notification:new", populated);
    }

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification: populated,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};