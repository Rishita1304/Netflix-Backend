const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{ type:String,require:true, unique:true },
    email:{ type:String, unique:true },
    password: {type:String,require:true},
    profilePic: {type:String, default: ''},
    isAdmin:{type:Boolean, default:false}
},
   { timestamps:true }
   );

   const User = mongoose.model('User', UserSchema)
 module.exports = User