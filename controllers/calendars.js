const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Child = require('../models/children')
const Calendar = require('../models/calendar')
const Book = require('../models/books')
const Entry = require('../models/entries')


const multer = require('multer')
const {storage} = require('../db/cloudinary')
const {cloudinary} = require('../db/cloudinary')
const upload = multer({storage})    




let today = new Date()
let showDate = today.toLocaleDateString()

//go to calendar 
router.get('/', (req,res) => {
    res.render('calendar/index')
})

router.get('/test', (req,res) => {
    res.render('calendar/calendar')
})
//new post auto set to upload to the same day
//Get New Posting for today only feature => may put this back into the new route    
router.get('/quickAdd', async(req,res, next) => {
    try{
        const user = await User.findOne({username: req.session.username})
        const children = await Child.find({parent: user.id})
        res.render('calendar/quickAdd', {children, date: showDate})
    }catch(err){
        next(err)
    }
})

router.post('/new', async(req,res,next) => {
    console.log(req.body)
    console.log(req.file)

    try{
        findChild = !req.body.childId ? req.body.childNames: req.body.childId
        const child = await Child.findOne({_id: findChild})
        let entry = {
            date: showDate,
            title: req.body.note,
            body: req.body.entry,
            calendar: true,
            child: child._id
        }
        if(req.file){
            entry = {...entry, picture:{url:req.file.path, filename: req.file.filename}}
        }
        const quickAddEntry = Entry.create({entry})
        res.redirect('/calendar/quickAdd')
    }catch(err){
        next(err)
    }
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