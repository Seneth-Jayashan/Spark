const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["info", "success", "warning", "error", "reminder", "system"],
      default: "info",
    },

    recipient: {
      type: Number,
      ref: "User",
    },

    targetRole: {
      type: String,
      enum: ["admin", "volunteer", "employee", "organizer", "org_member", "all"],
      default: "volunteer",
    },

    targetEvent: {
      type: Number, 
      ref: "Event",
    },

    isBroadcast: {
      type: Boolean,
      default: false,
    },

    actionUrl: {
      type: String,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;