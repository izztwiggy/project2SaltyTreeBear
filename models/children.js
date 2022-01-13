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
    profilePicture: {type: String, default: undefined},
    preferredName: {type:String, default: this.firstName},
    parent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child

