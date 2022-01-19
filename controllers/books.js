const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Book = require('../models/books')
const Child = require('../models/children')
const Entry = require('../models/entries')
const session = require('express-session')
const _ = require('lodash')

// 'books'

//PICK YOUR CHILDS SHELF ROUTE
router.get('/', async(req,res,next) => {
    try{
        const sessionUser = await User.findOne({username: req.session.username})
        if(sessionUser){
            const children = await Child.find({parent: sessionUser._id})
            if(children){
                res.render('books/choice', {children})
            }
        }
    }catch(err){
        next(err)
    }
})

//ger view
router.get('/bookshelf/:bookid/view',async (req,res,next) => {
    try{
     const book = await Book.findOne({_id: req.params.bookid})
     res.render('books/bookView', {book})
    }catch(err){
        next(err)
    }
 })

//POST create new book
router.post('/:childId/new', async(req,res,next) => {
    try{
       console.log(req.body)
       const child = await Child.findOne({_id:req.params.childId})
       if(child){
            let newStory = await Book.create(
                {
                    author: req.body.author,
                    cover: req.body.cover,
                    title: req.body.title,
                    story: req.body.story,
                    date: new Date(),
                    child: child._id
                }
            )
            if(newStory){
                // console.log('new Story')
                res.redirect(`/books/${child._id}/view`)
            }
       }
    }catch(err){
        next(err)
    }
})


//put book



router.delete('/:bookId/delete', async(req,res, next) => {
    try{    
        const deleteBook = await Book.findByIdAndDelete(req.params.bookId)
        if(deleteBook){
            res.redirect('/books')
        }
    }catch(err){
        next(err)
    }
})



router.put('bookshelf/:bookId', async(req,res, next) => {
   
    try{
        const book = await Book.findOneAndUpdate({_id: req.params.bookid})
        const user = await Book.findOne({_id: book.child})
        
        if(book){
            res.redirect(`books/${user.id}/view`)
        }
   }catch(err){
       next(err)
   }
})


//edit book - get
router.get('/bookshelf/:bookid/edit',async(req,res,next) => {
    try{
        const book = await Book.findOne({_id: req.params.bookid})
        if(book){
            res.render('books/bookEdit', {book})
        }
    }catch(err){
        next(err)
    }
})


//GET Write a book
router.get('/:childId/new', async(req,res,next) => {
    try{
        const child = await Child.findOne({_id: req.params.childId})
        res.render('books/writeStory', {child})
     }catch(err){
         next(err)
     }
}) 








//get childs bookshelf
router.get('/:childId/view',async (req,res,next) => {
    try{
        const child = await Child.findOne({_id: req.params.childId})
        if(child){
            const books = await Book.find({child: child._id})
            const orderedBooks = _.sortBy(books, 'date')
            res.render('books/bookshelf', {child, books:orderedBooks})
            // console.log(books)
            // if(books.length <= 3){
                // res.render('books/bookshelf', {child, books:orderedBooks})
            // } else {
                // const bookShelfArrs = _.chunk(books, 3)
                // console.log(bookShelfArrs)
            //     res.render('books/bookshelf', {child, bookChunks:bookShelfArrs})   
            // }
        }
        
    }catch(err){
      next(err)
    }
})


module.exports = router