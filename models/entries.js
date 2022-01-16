const mongoose = require('../db/connection.js')

const entrySchema = new mongoose.Schema({
    date: {type: Date, default: new Date()},
    title: String, 
    body: String,
    calendar: {type: Boolean, default: false},
    picture: {
        url: String, 
        filename: String
    },
    child:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }
})

const Entry = mongoose.model('Entry', entrySchema)

module.exports = Entry

