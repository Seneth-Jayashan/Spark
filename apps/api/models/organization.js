const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('./counter');

const organizationSchema = new Schema({
    org_id: {type:Number,unique:true},
    org_name: {type: String, required:true},
    org_description: {type:String, required:true},
    org_logo: {type: String, required:true},
    org_owner: {type: Number, required:true, unique:true},
    org_status: {type:Boolean,default:true},
    created_at: {type:Date, default:Date.now()}
})

organizationSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    try {
        const counter = await Counter.findOneAndUpdate(
            { name: 'org_id' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        this.org_id = counter.value;
        next();
    } catch (error) {
        next(error);
    }
});


const Organization = mongoose.model('Organization' , organizationSchema);

module.exports = Organization;