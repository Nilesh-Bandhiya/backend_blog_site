const mongoose = require('mongoose')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    phoneNumber:{
        type: Number,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique:true,
        lowercase:true,
        validate(value){
          if (!validator.isEmail(value)) {
            throw new Error("Email is Invalid")
          }
        }
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        lowercase: true,
        enum: ["admin", "user"]
    },
    active:{
        type: Boolean,
        required: true,
    },
    refreshToken:  {
        type: String
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User