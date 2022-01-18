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

//GET Write a book
router.get('/:childId/new', async(req,res,next) => {
    try{
        const child = await Child.findOne({_id: req.params.childId})
        res.render('books/writeStory', {child})
     }catch(err){
         next(err)
     }
}) 

// //GET Search API Book
// router.get('/bookshelf/search', (req,res) => {
//     res.render('books/bookAdd')
// }) 

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
                console.log('new Story')
                res.redirect(`/books/${child._id}/view`)
            }
       }
    }catch(err){
        next(err)
    }
})

//get childs bookshelf
router.get('/:childId/view',async (req,res,next) => {
    try{
        const child = await Child.findOne({_id: req.params.childId})
        if(child){
            res.render('books/bookshelf', {child})
        }
        
    }catch(err){
      next(err)
    }
})

//ger view
router.get('/bookshelf/:bookid/view',(req,res) => {
    res.render('books/bookView')
})
//edit book - get
router.get('/bookshelf/:bookid/edit/',(req,res) => {
    res.render('books/bookEdit')
})

//put book
router.put('bookshelf/:bookId/', (req,res) => {
    console.log(req.body)
})




// //route 2 : Search New Books in library API / GET => new
// router.get('/:childId/new', async(req,res,next) => {
//     try{
//         const child = await Child.findById(req.params.childId)
//         res.render('books/bookAdd', {child})
//     }catch(err){
//         next(err)
//     }

// })



// //GET NEW: add new stories written by users: posted on the childs 
// router.get('/:childId/create',async (req,res,next) => {
//     try{
//         const child = await Child.findById(req.params.childId)
//         if(child){
//             res.render('books/writeStory', {child})
//         }
//     }catch(err){
//         next(err)
//     }
// })


// router.get('/shelf/:childId', async(req,res, next) => {
//     try{
//         const child = await Child.findOne({_id: req.params.childId})
//         if(child){
//             const books = await Book.find({child:child.id})
//             // console.log('Created New Book')
//             if(books){
//                 console.log(books)
//                 res.render('books/bookshelf', {child, books})
//             }
//         }
//     }catch(err){
//         next(err)
//     }
// })

// router.post('/shelf/:childId', async (req,res, next) => {
//     try{
//         console.log(req.body)
//         const child = await Child.findOne({_id: req.body.childId.value})
//         console.log('publish a book')                                                                                                                                                                                                                                                                                                                          
//         // let storyData = {
//         //     author: req.body.author,
//         //     title: req.body.title,
//         //     body: req.body.story,               
//         //     cover: req.body.color,
//         //     published: false,
//         //     child: child._id
//         // }
//         // console.log(storyData)
//         const newStory = await Book.create({author: req.body.author,title: req.body.title, body: req.body.story,cover: req.body.color, published: false, child: child.id
//         })
//         console.log(newStory)
//         // if(newStory){
//         //     res.redirect(`/books/shelf/${child.id}`)   
//         // }
//     }catch(err){
//         next()
//     }
// })

//Post New Stories: From /books/:childId/create


//view story, click on book to view author name & year published
//route3: VIEW: GET / => show
// router.get('/:childId/:bookId/view', async(req,res,next) => {
//     try{
//         const child = Child.findById(req.params.childId)
//         const book = Book.findById(req.params.bookId)
//         if(book){
//             res.render('books/bookView', {book, child})
//         }
//     }catch(err){
//         next()
//     }
// })

//edit either pinned library books or created stories
//route 4: EDIT/ GET => edit
// router.get('/:bookid/edit', (req,res) => {
//     res.render('books/bookEdit.ejs')
// })

//put edits
// router.put('/:bookId', async(req,res,next) => {
//     try{
//         console.log(req.body)
//         const editBook = await Book.findByIdAndUpdate(req.params.bookId, req.body)
//         if(editBook){
//             res.redirect(`/book/${editBook.id}`)
//         }
//     }catch(err){
//         next(err)
//     }
// })

//delete created story or pinned book
//route5 DELETE: DELETE
// router.delete('/:bookId/delete', async(req,res, next) => {
//     try{    
//         console.log(req.params.id)
//         console.log('delete route')
//         const deleteBook = await Book.findByIdAndDelete(req.params.bookId)
//         if(deleteBook){
//             res.redirect('/books')
//         }
//     }catch(err){
//         next(err)
//     }
// })

module.exports = router