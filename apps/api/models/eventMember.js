const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require("./counter");

const eventMemberSchema = new Schema({
    event_member_id: { type: Number},
    event_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    registered_date: { type: Date, default: Date.now()}
});

eventMemberSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        const counterKey = `event_member_id${this.event_id}`;

        const counter = await Counter.findOneAndUpdate(
            { name: counterKey },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        this.event_member_id = counter.value;
        next();
    } catch (error) {
        next(error);
    }
});

const EventMember = mongoose.model('eventMember', eventMemberSchema);
module.exports = EventMember;
