const mongoose = require("mongoose");

const participationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Number, required: true },
    status: { type: String, enum: ["Participated", "Not Participated"], default: "Not Participated" },
  },
  { timestamps: true }
);

// Ensure one entry per user per event
participationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Participation", participationSchema);
