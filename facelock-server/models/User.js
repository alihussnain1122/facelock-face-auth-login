const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        unique: false
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    faceDescriptor:{
        type: [Number],
        default:[]
    },
    isVerified:{
        type: Boolean,
        default: false
    }
});

const User= mongoose.model('User', userSchema);
module.exports= User;