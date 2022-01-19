const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const User = require('../models/users')
const Child = require('../models/children')
const Entry = require('../models/entries')
const session = require('express-session')
const _ = require('lodash')


// const session = require('express-session')

const multer = require('multer')
const {storage} = require('../db/cloudinary')
const {cloudinary} = require('../db/cloudinary')
const { DefaultDeserializer } = require('v8')
const { runInNewContext } = require('vm')
const { lte, reverse, groupBy } = require('lodash')
const upload = multer({storage})

//  '/user/

function numberYears(){
    const current = new Date()
    console.log(current.getFullYear())
    let thisYear = current.getFullYear()
    return parseInt(thisYear)
}

function birthday(year,month,day){
    let birthday = new Date(year,month,day)
    return birthday.toDateString()
}

function calculateAge(year, month, day){
    let today = new Date()   
    let startDay = new Date(year,month,day)
    let startCheck = startDay.valueOf()
    let todayCheck = today.valueOf()
    const oneDay = (1000 * 60 * 60 * 24)
    
    let difference = todayCheck - startCheck
    return (Math.floor((difference /oneDay)/ 365))
}



//GET : HOME ROUTE 
router.get('/', async (req,res,next) =>{
   try{
        const currentUser = await User.findOne({username: req.session.username})
        const children = await Child.find({parent: currentUser._id})
        if(children && currentUser){
            console.log(children)
            res.render('users/homeUser.ejs', {user:currentUser, children:children, birthday, calculateAge})
        }
   }catch(err){
       next(err)
   }
})

//GET UPDATE EDIT USER FOR POST REGISTERING ROUTE
router.get('/update', (req,res) => {
    res.render('users/setup')
})
//PUT USER SETUP/EDIT ROUTE POST REGISTERING ***THIS IS NOT THE EDIT ROUTE ONCE PROFILE HAS BEEN CREATED
router.put('/update',upload.single('profilePicture'), async(req,res,next) => {
    try{
        if(req.body.annualEmail === 'on'){
            req.body.annualEmail = true
        } else {
            req.body.annualEmail = false
        }
        let data = {
            name: req.body.name,
            email: req.body.email,
            avatar: req.body.avatar,
            partnerEmail: req.body.partnerEmail,
            annualEmail: req.body.annualEmail
        }
        if(req.file){
            data = {...data, profilePicture:{url:req.file.path, filename: req.file.filename}}
        }
        console.log(data)
        const sessionUser = await User.findOneAndUpdate({username: req.session.username}, data, {new:true})
        if(sessionUser){
           
           res.redirect('/user/child/new')
        }
    }catch(err){
        next(err)
    }
})
//GET USER EDIT ROUTE
router.get('/edit', async(req,res,next) => {
    try{
        const user = await User.findOne({username:req.session.username})
        res.render('users/edit', {user})
    }catch(err){
        next(err)
    }
})
//PUT USER EDIT ROUTE
router.put('/edit', upload.single('profilePicture'), async(req,res, next) => {
        try{
            if(req.body.deleteCurrent){
                await cloudinary.uploader.destroy(req.body.deleteCurrent)
            }
            req.body.annualEmail = req.body.annualEmail === 'on' ? true : false
            let updateInfo = {
                name: req.body.name,
                email: req.body.email, 
                avatar: req.body.avatar,
                annualEmail: req.body.annualEmail, 
                partnerEmail: req.body.partnerEmail
            }
            if(req.file){
                updateInfo = {...updateInfo, profilePicture:{url:req.file.path, filename: req.file.filename}}
            } else if(!req.file && req.body.deleteCurrent){
                updateInfo = {
                    name: req.body.name,
                    email: req.body.email, 
                    avatar: req.body.avatar,
                    annualEmail: req.body.annualEmail, 
                    partnerEmail: req.body.partnerEmail,
                    profilePicture: {
                        url:'',
                        filename: ''
                    }
                }
            }
            const updateUser = await User.findOneAndUpdate({username: req.session.username}, updateInfo, {new:true})
            if(updateUser){
                res.redirect('/user')
            }
        }catch(err){
            next(err)
        }
})

                                                                                //CHILD ROUTES

//GET NEW CHILD ROUTE
router.get('/child/new', (req,res) => {
    res.render('children/add', {numberYears})
})
//POST NEW CHILD ROUTE
router.post('/', upload.single('profilePicture'), async(req,res,next) => {
    try{
        if(!req.body.birthDay || !req.body.birthMonth || !req.body.birthYear){
            req.session.message = 'Not able to Register, Please enter Child\'s full Date of Birth, MM-DD-YYYY'
            res.redirect('/user/child/new')
        }
        const findParent = await User.findOne({username: req.session.username})
        if(findParent){
            if(!req.body.preferredName){
                req.body.preferredName = req.body.firstName
            }
           let data = {
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                suffix: req.body.suffix,
                nickname: req.body.nickname,
                birthDay: req.body.birthDay,
                birthMonth:req.body.birthMonth,
                birthYear: req.body.birthYear,
                childEmail:req.body.childEmail,
                avatar: req.body.avatar,
                preferredName: req.body.preferredName,
                parent: findParent._id
            }
            if(req.file){
                data = {...data, profilePicture:{url:req.file.path, filename: req.file.filename}}
            }
            const createChild = await Child.create(data)
            await createChild.save()
            if(createChild){
                res.redirect('/user')
            }
        } 
    }catch(err){
        next(err)
    }
})

//GET SHOW ROUTE
router.get('/:id/child', async (req,res,next) => {
    try{
        const child = await Child.findOne({_id:req.params.id})
        if(child){
            const entries = await Entry.find({child: child._id})
            if(entries){
                let timeLineEntries = _.sortBy(entries, 'date')
               
                let groupByYear = timeLineEntries.reduce((groupYear, currEntry) => {
                    const year = currEntry.date.getFullYear()
                    groupYear[year] = !groupYear[year] ? []: groupYear[year]
                    groupYear[year].push(currEntry)
                    return groupYear
                }, {})              
                res.render('children/show', {child, entries:timeLineEntries, years:groupByYear, birthday, calculateAge})
            }
        }
    }catch(err){
        next(err)
    }
})

//PUT EDIT ROUTE
router.put('/:id/child',upload.single('profilePicture'), async(req,res,next) => {
    try{
        console.log(req.body)
        if(req.body.deleteCurrent){
           await cloudinary.uploader.destroy(req.body.deleteCurrent)
        }
        let data = {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            suffix: req.body.suffix,
            nickname: req.body.nickname,
            birthDay: req.body.birthDay,
            birthMonth:req.body.birthMonth,
            birthYear: req.body.birthYear,
            childEmail: req.body.childEmail,
            preferredName: req.body.preferredName,
            avatar: req.body.avatar
        }  
        if(req.file){
            data = {...data, profilePicture:{url:req.file.path, filename: req.file.filename}}
        } else if(!req.file && req.body.deleteCurrent){
            data = {
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                suffix: req.body.suffix,
                nickname: req.body.nickname,
                birthDay: req.body.birthDay,
                birthMonth:req.body.birthMonth,
                birthYear: req.body.birthYear,
                childEmail: req.body.childEmail,
                preferredName: req.body.preferredName,
                profilePicture:{
                    url:'',
                    filename:''
                }
            }

        }
        let editChild = await Child.findByIdAndUpdate(req.params.id, data, {new:true})
        if(editChild){
            res.redirect(`/user/${editChild._id}/child`)
        }
    }catch(err){
        next(err)
    }
})
//GET EDIT ROUTE
router.get('/:id/edit', async(req,res,next) => {
    try{
        const child = await Child.findOne({_id: req.params.id})
        res.render('children/edit', {child,numberYears})
    }catch(err){
        next(err)
    }
})

                                                                        //CHILD ENTRY ROUTES

//GET NEW profile entry: create own prompt
router.get('/:id/entry/create', async(req,res,next) => {
    try{
        const child = await Child.findOne({_id: req.params.id})
        if(child){
            res.render('children/entriesAddCreate', {child})
        }
     }catch(err){
       next(err)
     }
})

//GET NEW profile entry: PREMADE PROMPTS
router.get('/:id/entry/prompts', async(req,res,next) => {
    try{
        const child = await Child.findOne({_id: req.params.id})
        if(child){
            res.render('children/entriesAddPrompt', {child})
        }
     }catch(err){
       next(err)
     }
})

//POST NEW POST
router.post('/:id/entry', async(req,res,next) => {
    try{
        if(!req.body.date){
            req.body.date = new Date()
        }
        const child = await Child.findOne({_id: req.params.id})
        if(child){
            const entry = Entry.create({...req.body, child: child._id})
            res.redirect(`/user/${child._id}/child`)
        }
    }catch(err){
        next(err)
    }
})

                                                                                        //CHILD DELETE ROUTE
//CHILD DELETE ROUTE
router.delete('/:id/delete', async (req,res, next) => {
    try{
        if(req.body.filename){
            await cloudinary.uploader.destroy(req.body.filename)
        }
        const entriesToDelete = await Entry.deleteMany({child: req.params.id})
        const deletedChild = await Child.findByIdAndDelete(req.params.id)
        res.redirect('/user')
    }catch(err){
      next(err)
    }
})



//GET Entry SHOW
router.get('/:id/entry/:entryId', async(req,res,next)=> {
    try{
        const child = await Child.findOne({_id: req.params.id})
        const entry = await Entry.findOne({_id: req.params.entryId})
        let time = entry.date.toDateString()
        res.render('children/entryView', {child, entry, time})
    }catch(err){
       next(err)
    }
})

//GET Edit Entry
router.get('/:id/entry/:entryId/edit', async(req,res,next)=> {
    try{
        const child = await Child.findOne({_id: req.params.id})
        const entry = await Entry.findOne({_id: req.params.entryId})
        res.render('children/entriesEdit', {child, entry})
     }catch(err){
       next(err)
     }
})


//PUT Edit Entry 
router.put('/:id/entry/:entryId', async(req,res,next) => {
    try{
        req.body.date = !req.body.date ? new Date() : req.body.date
        const child = await Child.findOne({_id: req.params.id})
        if(child){  
            const entry = await Entry.findByIdAndUpdate(req.params.entryId, req.body, {new:true})
            res.redirect(`/user/${child._id}/child`)
        }
    }catch(err){
       next(err)
    }
})


//DELETE ENTRY
router.delete('/:id/:entryId/delete', async(req,res,next)=> {
    try{
        const deleteEntry = await Entry.findByIdAndDelete(req.params.entryId)
        res.redirect(`/user/${req.params.id}/child`)
     }catch(err){
       next(err)
     }
})





module.exports = router