const express = require("express");
const router = express.Router();

const Notification = require("../controllers/notificationController.js");
const authMiddleware = require("../middleware/authMiddleware.js");


router.post("/", Notification.createNotification);

// Get notifications for logged-in user
router.get("/me", authMiddleware(['admin', 'volunteer', 'organizer']), Notification.getUserNotifications);

// Get all (admin/dashboard)
router.get("/", authMiddleware(['admin', 'volunteer', 'employee', 'organizer', 'org_member']), Notification.getAllNotifications);

// Mark as read
router.patch("/:id/read", authMiddleware(['admin', 'volunteer', 'employee', 'organizer', 'org_member']), Notification.markAsRead);

// Delete
router.delete("/:id", authMiddleware(['admin']), Notification.deleteNotification);

module.exports = router;
