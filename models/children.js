const mongoose = require('../db/connection.js')

const childSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    nickname: {type: String, default: undefined},
    birthDate: Date,
    childEmail:{type: String, default: undefined},
    profilePicture: {type: String, default: undefined},
    parent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    profileAdds: {type: [
        {
            prompt: String,
            response: String
        }
    ], default: undefined}
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child

