const mongoose = require('../db/connection')

const calendarSchema = new mongoose.Schema({
    calStart: Date, 
    entries: [
        {
            date: String,
            body: String
        }
    ],
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }
})

const Calendar = mongoose.model('Calendar', calendarSchema)

module.exports = Calendar