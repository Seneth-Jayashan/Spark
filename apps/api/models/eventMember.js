const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require("./counter"); 

const eventMemberSchema = new Schema({
    event_member_id: { 
        type: Number, 
        unique: true 
    },
    event_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    
    status: {
        type: String, 
        default: "Not Participated", 
        enum: ["Participated", "Not Participated"]
    },
    
    registered_date: { 
        type: Date, 
        default: Date.now 
    }
});

eventMemberSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

eventMemberSchema.pre('save', async function (next) {
    // Only run this function if the document is new
    if (!this.isNew) {
        return next();
    }

    try {
      
        const counterKey = 'eventMember';

        const counter = await Counter.findOneAndUpdate(
            { name: counterKey },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        this.event_member_id = counter.value; // Assign the new global unique ID
        next();
    } catch (error) {
        next(error);
    }
});

const EventMember = mongoose.model('eventMember', eventMemberSchema);
module.exports = EventMember;