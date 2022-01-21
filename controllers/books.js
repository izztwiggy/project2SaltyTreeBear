const express = require('express')
const router = express.Router()
const _ = require('lodash')

const User = require('../models/users')
const Book = require('../models/books')
const Child = require('../models/children')
const Entry = require('../models/entries')
// const session = require('express-session')


// 'books'
function getDate() {
    const today = new Date()

    const options = {
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
    }
    return today.toLocaleDateString('en-US', options)
}

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


//GET  view
router.get('/bookshelf/:bookId/view',async (req,res,next) => {
    try{
     const book = await Book.findOne({_id: req.params.bookId})
     const child = await Child.findOne({_id: book.child})
     if(book && child){
        res.render('books/bookView', {book, child})
     }
    }catch(err){
        next(err)
    }
 })

//put book
router.put('/bookshelf/:bookId', async(req,res, next) => {
    try{
        const bookEdit = {
                author: req.body.author,
                cover: req.body.cover,
                title: req.body.title,
                story: req.body.story,
            }
        
        const book = await Book.findOneAndUpdate({id: req.params.bookId}, bookEdit, {new:true})
        book.save()
        if(book){
            res.redirect(`/books/bookshelf/${book._id}/view`)
        }
   }catch(err){
       next(err)
   }
})


router.delete('/:bookId/delete', async(req,res, next) => {
    try{    
        const deleteBook = await Book.findByIdAndDelete(req.params.bookId)
        const child = await Child.findOne({_id: deleteBook.child})
        if(child){
            res.redirect(`/books/${child._id}/view`)
        }
    }catch(err){
        next(err)
    }
})



//edit book - get
router.get('/:bookId/edit',async(req,res,next) => {
    try{
        const book = await Book.findOne({_id: req.params.bookId})
        if(book){
            res.render('books/bookEdit', {book})
        }
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
                    date: getDate(),
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