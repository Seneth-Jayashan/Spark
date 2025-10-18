const { createNotification } = require('../utils/notification.js');
const User = require("../models/user.js");
const EventMember = require("../models/eventMember.js");
const Event = require("../models/event.js"); 
const Notification = require('../models/notification.js');

/**
 * 📢 Create Notification (HTTP Request Handler)
 * This function handles the API request and calls the notification service.
 */
exports.createNotification = async (req, res) => {
  try {
    // Pass the request body directly to the service
    const saved = await createNotification(req.body);

    if (saved.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: "Notification criteria met, but no recipients found.",
        data: [],
      });
    }

    res.status(201).json({
      success: true,
      count: saved.length,
      message: `${saved.length} notification(s) sent successfully.`,
      data: saved,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    
    // Handle validation errors from the service
    if (error.message.startsWith("Invalid") || error.message.startsWith("Title")) {
        return res.status(400).json({ success: false, message: error.message });
    }
    
    // Handle general server errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * 📨 Get notifications for a specific user (by logged-in user)
 * Assumes auth middleware adds user object with 'user_id' to req.user
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id; 

    if (!userId) {
        return res.status(401).json({ message: "Authentication error. User ID not found." });
    }

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate({
          path: "targetEvent",
          model: "Event", // Explicitly state model
          foreignField: "event_id", // The field on the Event model
          localField: "targetEvent"  // The field on the Notification model
      });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 🧾 Get all notifications (for admin or dashboard)
 */
exports.getAllNotifications = async (req, res) => {
  try {
    const { role, eventId } = req.query;
    const filter = {};

    if (role) filter.targetRole = role;
    if (eventId) filter.targetEvent = eventId; // Assumes numeric eventId

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .populate({
          path: "recipient",
          model: "User",
          select: "user_first_name user_last_name user_email user_role user_id",
          foreignField: "user_id", // The field on the User model
          localField: "recipient" // The field on the Notification model
      })
      .populate({
          path: "targetEvent",
          model: "Event",
          select: "name date event_id", // 'name' and 'date' are assumed
          foreignField: "event_id",
          localField: "targetEvent"
      });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * ✅ Mark notification as read
 * (No changes needed, uses notification's primary _id)
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params; // This is the notification's _id
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (error) {
    console.error("Error marking as read:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * ❌ Delete a notification
 * (No changes needed, uses notification's primary _id)
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params; // This is the notification's _id

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};