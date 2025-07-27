const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('./counter');

const userSchema = new Schema({
    user_id: {type: Number, unique:true},
    user_first_name: {type: String, required:true},
    user_last_name: {type: String, required:true},
    user_address: {type: String, required:true},
    user_phone_number: {type: Number, required:true},
    user_email: {type:String,required:true,unique:true},
    user_password: {type:String,required:true},
    user_profile_picture: {type: String, required:true},
    user_role: {type:String, enum: ['admin','volunteer','employee','organizer','org_member'],default:'volunteer'},
    user_verified: {type:Boolean,default:false},
    user_status: {type: String,enum: ['active','inactive'],default: 'active'},
    user_interested : [{type:String ,default: null}],
    created_at: {type:Date, default:Date.now()} 
})

userSchema.pre('save', async function (next){
    if(!this.isNew) return next();

    try{
        const counter = await Counter.findOneAndUpdate(
            {name: 'user_id'},
            {$inc:{value:1}},
            {new:true,upsert:true}
        );
        this.user_id = counter.value;
        next();
    }catch(error){
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;