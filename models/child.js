const mongoose = require('../db/connection.js')

const childSchema = new mongoose.Schema({
    name: {type:String, require: true},
    birthDate: Date,
    email:String,
    bookshelf: [mongoose.Schema.Types.ObjectId],
    calendar: mongoose.Schema.Types.ObjectId
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child