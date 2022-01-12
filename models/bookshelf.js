const mongoose = require('../db/connection')

const bookshelfSchema = new mongoose.Schema({
    books: [
        {
            title: String,
            author: String, 
            body: String, 
            cover: String,
            year: String,
            published: Boolean
        }
    ],
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    }
})

const Bookshelf = mongoose.model('Bookshelf', bookshelfSchema)

module.exports = Bookshelf