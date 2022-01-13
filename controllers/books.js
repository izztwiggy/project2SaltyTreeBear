const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Child = require('../models/children')
const Calendar = require('../models/calendar')
const Book = require('../models/books')
const session = require('express-session')

router.get('/', (req,res) => {
    res.render('books/bookshelf.ejs')
})

//route 2 : Search New Books in library API / GET => new
router.get('/new', (req,res) => {
    res.render('books/bookAdd.ejs')
})

//GET NEW: add new stories written by users
router.get('/create', (req,res) => {
    res.render('books/bookAdd.ejs')
})

//view story, click on book to view author name & year published
//route3: VIEW: GET / => show
router.get('/:bookid', (req,res) => {
    res.render('books/bookView.ejs')
})

//edit either pinned library books or created stories
//route 4: EDIT/ GET => edit
router.get('/:bookid/edit', (req,res) => {
    res.render('books/bookEdit.ejs')
})

//delete created story or pinned book
//route5 DELETE: DELETE
router.delete('/:id', (req,res) => {
    console.log(req.params.id)
    console.log('delete route')
})

module.exports = router