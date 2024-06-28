const  mongoose = require('mongoose');
const {Schema} = mongoose
const AddContact = new Schema({
    friendId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Register'
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Contact',AddContact)