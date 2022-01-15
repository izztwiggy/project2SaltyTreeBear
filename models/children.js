const mongoose = require('../db/connection.js')

const childSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    nickname: {type: String, default: undefined},
    birthDay: {type:String, required: true},
    birthMonth:{type:String, required: true},
    birthYear: {type: String, require:true},
    childEmail:String,
    profilePicture: {
        url: String, 
        filename: String
    },
    avatar: String,
    preferredName: {type:String, default: this.firstName},
    addOns: [
        {
            prompt:String,
            response: String
        }
    ],
    parent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child

