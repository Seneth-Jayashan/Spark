const Participation = require("../models/volunteerParticipation");
const Event = require('../models/event');
const EventMember = require('../models/eventMember');
const User = require('../models/user'); 
const { createNotification } = require('../utils/notification');


exports.updateParticipation = async (req, res) => {
  const { eventId, userId, status } = req.body;

  if (!eventId || !userId || !status) {
    return res.status(400).json({ message: "Event ID, User ID, and status are required" });
  }

  try {
    const event = await Event.findOne({ event_id: eventId });
    if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
    }

    const participation = await EventMember.findOneAndUpdate(
      { event_id: eventId, user_id: userId }, 
      { status: status },
      { new: true, upsert: true }
    );

    await createNotification({
        title: `Volunteer Participation Updated`, 
        message: `Event - ${event.event_name}\nStatus - ${status}`, 
        type: 'info',
        targetRole: 'volunteer', 
        recipient: userId,      
        isBroadcast: false    
    });

    res.status(200).json({ success: true, participation });
  } catch (error) {
    console.error("Error updating participation:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getEventParticipations = async (req, res) => {
  const { event_id } = req.params;

  try {
    const event = await Event.findOne({ event_id: event_id });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }



    const eventParticipations = await EventMember.find({ event_id })
      .populate({
          path: 'user_id',
          model: 'User',
          foreignField: 'user_id',
          localField: 'userId',  
          select: 'name email profilePic'
      });

      
    if (!eventParticipations || eventParticipations.length === 0) {
      return res.status(200).json({ 
          message: "No participation records found for this event", 
          eventParticipations: [] // Return empty array
      });
    }
    res.status(200).json({ message: 'Event participation data found', eventParticipations });
  } catch (error) {
    console.error("Error fetching participation:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};