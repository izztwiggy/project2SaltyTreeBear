const mongoose = require('../db/connection.js')

const childSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    suffix: String,
    nickname:String,
    preferredName: {type:String, default: this.firstName}, 
    birthDay: {type:String, required: true},
    birthMonth:{type:String, required: true},
    birthYear: {type: String, require:true},
    childEmail:String,
    avatar: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    profilePicture: {
        url: String, 
        filename: String
    }
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child

