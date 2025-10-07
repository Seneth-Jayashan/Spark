const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    required: true,
  },
  sender_id: {
    type: String,
    required: true, // user_id or admin_id
  },
  sender_role: {
    type: String,
    enum: ['volunteer', 'organizer', 'org_member'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
