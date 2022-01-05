const mongoose = require('../db/connection.js')

const bookshelfSchema = new mongoose.Schema({
    title: String, 
    body: String, 
    cover: String
})

const Bookshelf = mongoose.model('Bookshelf', bookshelfSchema)

module.exports = Bookshelf