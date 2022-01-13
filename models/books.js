const mongoose = require('../db/connection')

const bookSchema = new mongoose.Schema({
    author: String, 
    title: String,
    story: String,
    published: Boolean,
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book