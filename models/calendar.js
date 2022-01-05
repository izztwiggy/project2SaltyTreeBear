const mongoose = require('../db/connection.js')

const calendarSchema = new mongoose.Schema({
    startingDate: Date,
    dataEntry: [String]
})

const Calendar = mongoose.model('Calendar', calendarSchema)

module.exports = Calendar