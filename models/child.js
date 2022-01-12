const mongoose = require('../db/connection')

const childSchema = new mongoose.Schema({
    firstName: {type:String, required: true},
    lastName: {type:String,required: true},
    birthDate: {type: String, required: true},
    email:String,
    bookshelf: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bookshelf'
        }
    ],
    calendar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calendar'
    }
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child