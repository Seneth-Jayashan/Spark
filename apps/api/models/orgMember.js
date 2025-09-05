const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require("./counter");

const orgMemberSchema = new Schema({
    org_member_id: { type: Number},
    org_id: { type: Object , required: true },
    user_id: { type: Number, required: true },
    registered_date: { type: Date, default: Date.now()}
});

orgMemberSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        const counterKey = `org_member_id${this.org_id}`;

        const counter = await Counter.findOneAndUpdate(
            { name: counterKey },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        this.org_member_id = counter.value;
        next();
    } catch (error) {
        next(error);
    }
});

const OrgMember = mongoose.model('orgMember', orgMemberSchema);
module.exports = OrgMember;
