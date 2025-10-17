const express = require("express");
const router = express.Router();
const { updateParticipation,getEventParticipations} = require("../controllers/volunteerParticipation");

// Update or save participation
router.get("/event/:event_id", getEventParticipations)
router.post("/update", updateParticipation);

module.exports = router;
