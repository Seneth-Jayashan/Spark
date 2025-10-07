const Chat = require("../models/chatModel");
const User = require("../models/user");
const Organization = require("../models/organization");

// Get all chat messages for a specific ticket
exports.getChatsByEventId = async (req, res) => {
  try {
    const chats = await Chat.find({ eventId: req.params.eventId }).sort("timestamp");
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new chat message
exports.addChatMessage = async (req, res) => {
  try {
    const { eventId, sender_id, sender_role, message } = req.body;

    let sender_name = undefined;
    let sender_avatar = undefined;

    if (sender_role === "organizer") {
      const org = await Organization.findOne({ org_id: Number(sender_id) }).lean();
      if (org) {
        sender_name = org.org_name;
        sender_avatar = org.org_logo || undefined;
      }
    } else {
      const user = await User.findOne({ user_id: Number(sender_id) }).lean();
      if (user) {
        sender_name = `${user.user_first_name} ${user.user_last_name}`.trim();
        sender_avatar = user.user_profile_picture || undefined;
      }
    }

    const newChat = new Chat({ eventId, sender_id, sender_role, sender_name, sender_avatar, message });
    await newChat.save();

    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
