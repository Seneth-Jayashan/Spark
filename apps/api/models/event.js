const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('./counter');

const eventSchema = new Schema({
    event_id: {type:Number,unique:true},
    event_name: {type:String, required:true},
    event_description: {type:String, required:true},
    event_images: [{type:String,required:true}],
    event_date: {type:Date,required:true},
    event_time: {type:String,required:true},
    event_venue: {type:String, required:true},
    event_geolocation: {type:String, required:true},
    event_status: {type:Boolean, default:false},
    event_org: {type:Number, required:true},
    created_at: {type:Date, default:Date.now()}
});

eventSchema.pre('save', async function (next) {
    if(!this.isNew) return next();

    try{
        const counter = await Counter.findOneAndUpdate(
            {name: 'event_id'},
            {$inc:{value:1}},
            {new:true,upsert:true}
        );
        this.event_id = counter.value;
        next();
    }catch(error){
        next(error);
    }
});

const Event = mongoose.model('event', eventSchema);

module.exports = Event;