const express = require("express");
const router = express.Router();
const { updateParticipation } = require("../controllers/volunteerParticipation");

// Update or save participation
router.post("/update", updateParticipation);

module.exports = router;
