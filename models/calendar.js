const mongoose = require('../db/connection')

const calendarSchema = new mongoose.Schema({
    startingDate: Date,
    dateEntry: [
        {
            date: String,
            title: String,
            body: String
        }
    ]
})

const Calendar = mongoose.model('Calendar', calendarSchema)

module.exports = Calendar