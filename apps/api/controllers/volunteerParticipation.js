const Participation = require("../models/volunteerParticipation");

// Save or update participation status
exports.updateParticipation = async (req, res) => {
  const { eventId, userId, status } = req.body;

  if (!eventId || !userId || !status) {
    return res.status(400).json({ message: "Event ID, User ID, and status are required" });
  }

  try {
    const participation = await Participation.findOneAndUpdate(
      { eventId, userId },
      { status },
      { new: true, upsert: true } // Create if doesn't exist
    );

    res.json({ success: true, participation });
  } catch (error) {
    console.error("Error updating participation:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
