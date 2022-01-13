const mongoose = require('../db/connection')

const userSchema = new mongoose.Schema({
    username: {type: String,unique: true,required: true}, 
    password:{type: String, required: true},
    name: String,
    email: String,
    profilePicture:{type: String, default: undefined},
    annualEmail:{type: Boolean, default: false},
    partner: {type: Boolean, default: false},
    partnerEmail: String
})

const User = mongoose.model('User', userSchema)

module.exports = User

