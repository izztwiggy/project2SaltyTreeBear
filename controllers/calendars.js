const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Child = require('../models/children')
const Calendar = require('../models/calendar')
const Book = require('../models/books')
const session = require('express-session')

//go to calendar 
router.get('/', (req,res) => {
    res.render('calendar/index')
})

//new post auto set to upload to the same day
//Get New Posting for today only feature => may put this back into the new route    
router.get('/quickAdd', (req,res) => {
    res.render('calendar/quickAdd')
})

//create posting while within that calendar section (Not quick add but may merge)
//Get Create New Posting
router.get('/:date/new', (req,res) => {
    res.render('calendar/new')
})

//edit a posting on any day
//Get Edit Route
router.get('/:date/edit', (req,res) => {
    res.render('calendar/edit')
})

//view a specific days postigns
//Get View Route
router.get('/:date', (req,res) => {
    res.render('calendar/view')
})

router.delete('/:date/:post', (req,res) => {
    console.log('delete route')
})

module.exports = router