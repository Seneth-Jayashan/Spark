const Notification = require("../models/notification.js");
const User = require("../models/user.js");
const EventMember = require("../models/eventMember.js");

/**
 * 📢 Create Notification Service
 * This reusable function creates and saves notifications to the DB.
 * It can be called from controllers or other services.
 *
 * @param {object} data - Notification data object
 * @returns {Promise<Array>} - A promise that resolves to the array of saved notification documents.
 */
async function createNotification(data) {
  const {
    title,
    message,
    type,
    recipient, // Expects a numeric user_id
    targetRole,
    targetEvent, // Expects a numeric event_id
    isBroadcast,
    actionUrl,
  } = data;

  console.log('Notification',data);
  if (!title || !message) {
    throw new Error("Title and message are required.");
  }

  let notifications = [];

  // 🔹 CASE 1: Broadcast to all users of a role
  if (isBroadcast && targetRole && targetRole !== "all" && !targetEvent) {
    const users = await User.find({ user_role: targetRole });
    notifications = users.map((u) => ({
      title,
      message,
      type,
      recipient: u.user_id, // Use numeric user_id
      targetRole,
      isBroadcast,
      actionUrl,
    }));
  }

  // 🔹 CASE 2: Broadcast to all volunteers in a specific event
  else if (isBroadcast && targetEvent) {
    const members = await EventMember.find({ event_id: targetEvent });
    if (!members || !members.length) {
      return []; // No one to notify, return empty array
    }
    notifications = members.map((v) => ({
      title,
      message,
      type,
      recipient: v.user_id, // Use numeric user_id from EventMember
      targetRole: "volunteer",
      targetEvent,
      isBroadcast,
      actionUrl,
    }));
  }

  // 🔹 CASE 3: Broadcast to all users (system-wide)
  else if (isBroadcast && targetRole === "all") {
    const users = await User.find();
    notifications = users.map((u) => ({
      title,
      message,
      type,
      recipient: u.user_id, // Use numeric user_id
      targetRole: "all",
      isBroadcast,
      actionUrl,
    }));
  }

  // 🔹 CASE 4: Direct message to a single recipient
  else if (recipient) {
    notifications.push({
      title,
      message,
      type,
      recipient,
      targetRole,
      targetEvent,
      isBroadcast: false,
      actionUrl,
    });
  }

  // ❌ Invalid combination
  else {
    throw new Error("Invalid notification parameters. Provide either recipient, targetRole, or targetEvent.");
  }

  // Save notifications (single or batch)
  if (notifications.length === 0) {
    return []; // No notifications were generated
  }
  
  const saved = await Notification.insertMany(notifications);
  return saved;
}

// Export using CommonJS
module.exports = { createNotification };