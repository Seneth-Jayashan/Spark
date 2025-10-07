const Event = require('../models/event');
const Member = require('../models/eventMember');
const Organization = require('../models/organization');

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }

        res.status(200).json({ message: `${events.length} events found`, events });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPublicEvents = async (req, res) => {
    try {
        const events = await Event.find({event_status:true});

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found' });
        }

        res.status(200).json({ message: `${events.length} events found`, events });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const {event_id} = req.params;

        const event = await Event.findOne({ event_id });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event found', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEventByOrg = async (req, res) => {
    try {
        const {event_org} = req.params;

        const events = await Event.find({ event_org });

        if (!events) {
            return res.status(404).json({ message: 'No events' });
        }

        res.status(200).json({ message: `${events.length} Events found`, events });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addEvent = async (req, res) => {
    try {
        const {
            event_name,
            event_description,
            event_time,
            event_date,
            event_venue,
            event_geolocation,
            need_count,
        } = req.body;

        const org_owner = req.user.id;

        const org = await Organization.findOne({org_owner});
        if(!org){
            return res.status(401).json({message:'First Create a Organization'});
        }
        const event_org = org.org_id;

        const event = new Event({
            event_name,
            event_description,
            event_images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : [],
            event_time,
            event_date,
            event_venue,
            event_geolocation,
            event_org,
            need_count
        });

        await event.save();
        res.status(200).json({ message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const {event_id} = req.params;

        const event = await Event.findOne({ event_id });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const {
            event_name,
            event_description,
            event_time,
            event_date,
            event_venue,
            event_geolocation,
            need_count,
        } = req.body;

        const event_images = req.files?.length? req.files.map(file => `/uploads/${file.filename}`): event.event_images || [];
        
        const updateData = {
            event_name,
            event_description,
            event_time,
            event_date,
            event_venue,
            event_geolocation,
            event_images,
            need_count
        };

        const updatedEvent = await Event.findOneAndUpdate({ event_id }, updateData, { new: true });

        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const {event_id} = req.params;

        const deleted = await Event.findOneAndDelete({ event_id });

        if (!deleted) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { user_id } = req.body;

        // Check if event exists
        const event = await Event.findOne({ event_id });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // ❌ REMOVE this global check (prevents multiple events)
        // const member = await Member.findOne({ user_id });
        // if (member) {
        //     return res.status(403).json({ message: 'User is already a member' });
        // }

        // ✅ Only check membership for this event
        const eventMember = await Member.findOne({ user_id, event_id });
        if (eventMember) {
            return res.status(403).json({ message: 'User is already a member of this event' });
        }

        // Add new member to event
        const newMember = new Member({
            user_id,
            event_id
        });

        await newMember.save();

        res.status(200).json({ message: 'Member added successfully', member: newMember });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMembersByEventId = async(req,res) => {
    try{
        const {event_id} = req.params;

        const event = await Event.findOne({event_id});

        if(!event){
            return res.status(404).json({ message: 'Event not found' });
        }

        const members = await Member.find({event_id});

        if(!members){
            return res.status(404).json({message: '0 members found'});
        }

        

        res.status(200).json({message: `${members.length} members found`, members});
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getEventsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find all membership records for the user
    const userMembers = await Member.find({ user_id });

    if (!userMembers || userMembers.length === 0) {
      return res
        .status(404)
        .json({ message: "User isn't associated with any event" });
    }

    // Extract all event IDs from the member records
    const eventIds = userMembers.map((member) => member.event_id);

    // Find all events where event_id is in that list
    const events = await Event.find({ event_id: { $in: eventIds } });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    res.status(200).json({ message: "Events found", events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.removeMember = async(req,res) => {
    try{
        const {event_id} = req.params;
        const {user_id} = req.body;

        const event = await Event.findOne({event_id});

        if(!event){
            return res.status(404).json({ message: 'Event not found' });
        }

        const member = await Member.findOne({user_id});
        if(!member){
            return res.status(403).json({ message: "User isn't associate with any event" });
        }

        const eventMember = await Member.findOne({ user_id, event_id });
        if (!eventMember) {
            return res.status(403).json({ message: "User isn't associate with this event" });
        }

        await Member.findOneAndDelete({user_id,event_id});

        res.status(200).json({message: "User remove from this event"});
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.updateEventStatus = async (req, res) => {
    try {
        const {event_id} = req.params;
        const { status } = req.body;

        const event = await Event.findOne({ event_id });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.event_status = status;
        await event.save();

        res.status(200).json({ message: 'Event status updated', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeAllMembersFromEvent = async (req, res) => {
    try {
        const { event_id } = req.params;

        const event = await Event.findOne({ event_id });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const result = await Member.deleteMany({ event_id });

        res.status(200).json({ 
            message: `${result.deletedCount} member(s) removed from the event.` 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};