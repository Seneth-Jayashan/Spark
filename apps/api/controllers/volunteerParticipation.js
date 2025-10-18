const Participation = require("../models/volunteerParticipation");
const Event = require('../models/event');
const User = require('../models/user');
const {createNotification} = require('../utils/notification');


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
      { new: true, upsert: true }
    );

    const event = await Event.findOne({event_id:eventId});

    await createNotification({
        title: `Volunteer Participation Updated`, 
        message: `Event - ${event.event_name}\nStatus - ${status}`, 
        type: 'info',
        targetRole: 'volunteer',
        recipient: userId,
        isBroadcast: true
    });

    res.json({ success: true, participation });
  } catch (error) {
    console.error("Error updating participation:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getEventParticipations = async(req,res) => {

  const event_id = req.params.event_id;
  console.log('eventId: ',event_id);

  try{
    const eventParticipations = await Participation.find({eventId:event_id});
    if(!eventParticipations){
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({message:'Event Data Found',eventParticipations});
  } catch (error) {
    console.error("Error fetching participation:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }

}
