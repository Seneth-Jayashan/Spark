const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/:eventId", chatController.getChatsByTicketId);
router.post("/", chatController.addChatMessage);

module.exports = router;
