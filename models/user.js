const mongoose = require('../db/connection')
const passportLocalMongoose = require('passport-local-mongoose')
const findOrCreate = require('mongoose-findorcreate')

const userSchema = new mongoose.Schema({
    username: {type: String, required: true}, 
    password: String,
    googleId: String,
    facebookId: String,
    email: String,
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Child'
        }
    ]
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

const User = mongoose.model('User', userSchema)

module.exports = User