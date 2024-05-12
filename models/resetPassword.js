const mongoose  =require('mongoose');

const passwordRessetSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    token:{
        type:String,
        required:true,
        ref:'User'
    }
});

module.exports  = mongoose.model("PasswordReset" , passwordRessetSchema);
