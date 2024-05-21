const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
        },
        otp:{
            type:Number,
            required:true,
        },
        timestamp:{
            type:Date,
            default:Date.now,
            required:true,
            get: (timestamp) => timestamp.getTime(),        //timestamp give the currnet date&time
            set: (timestamp) => new Date(timestamp),
        },
    },

);

module.exports = mongoose.model('OTP', otpSchema);
