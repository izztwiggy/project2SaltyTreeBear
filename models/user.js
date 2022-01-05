const mongoose = require('../db/connection.js')

const userSchema = new mongoose.Schema({
    username: {type: String, require: true}, 
    password: {type: String, require: true},
    children: [mongoose.Schema.Types.ObjectId]
})

const User = mongoose.model('User', userSchema)

module.exports = User