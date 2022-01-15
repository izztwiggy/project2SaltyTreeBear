const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Child = require('../models/children')
// const session = require('express-session')
const multer = require('multer')
const {storage} = require('../db/cloudinary')
const {cloudinary} = require('../db/cloudinary')
const upload = multer({storage})

//  '/user/

function numberYears(){
    const current = new Date()
    console.log(current.getFullYear())
    let thisYear = current.getFullYear()
    return parseInt(thisYear)
}

//GET : HOME ROUTE 
router.get('/', async (req,res,next) =>{
   try{
        const currentUser = await User.findOne({username: req.session.username})
        const userChildren = await Child.find({parent: currentUser._id})
        if(userChildren){
            console.log(userChildren)
            res.render('users/index.ejs', {user:currentUser, children:userChildren})
        } 
   }catch(err){
       next(err)
   }
})

//GET UPDATE EDIT USER FOR POST REGISTERING ROUTE
router.get('/update', (req,res) => {
    res.render('users/setup')
})

//PUT USER SETUP/EDIT ROUTE POST REGISTERING
router.put('/update',upload.single('profilePicture'), async(req,res,next) => {
    try{
        if(req.body.annualEmail === 'on'){
            req.body.annualEmail = true
        }
        let data = {
            name: req.body.name,
            email: req.body.email,
            avatar: req.body.avatar,
            annualEmail: req.body.annualEmail, 
            partnerEmail: req.body.partnerEmail
        }

        if(req.file){
            data = {...data, profilePicture:{url:req.file.path, filename: req.file.filename}}
        }
        console.log(data)
        const sessionUser = await User.findOneAndUpdate({username: req.session.username},data, {new:true})
        if(sessionUser){
           console.log(sessionUser)
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
            console.log(req.file)
            if(req.body.annualEmail === 'on'){
                req.body.annualEmail = true
            }
            const updateInfo = {
                name: req.body.name,
                email: req.body.email, 
                avatar: req.body.avatar,
                annualEmail: req.body.annualEmail, 
                partnerEmail: req.body.partnerEmail
            }
            if(req.file){
                updateInfo = {...data, profilePicture:{url:req.file.path, filename: req.file.filename}}
            }
            User.findOneAndUpdate({username: req.session.username},updateInfo, {new:true},(err, updatedUser) => {
                if(err){
                    console.log(err)
                    req.session.message = 'Unable to edit, please try again'
                } else {
                    console.log(updatedUser)
                    res.redirect('/user')
                }
            })
        }catch(err){
            next(err)
        }
})

//GET NEW CHILD ROUTE
router.get('/child/new', (req,res) => {
    res.render('children/add', {numberYears})
})
//POST NEW CHILD ROUTE
router.post('/', upload.single('profilePicture'), async(req,res,next) => {
    try{
        console.log(req.file)
        console.log(req.body)
        const findParent = await User.findOne({username: req.session.username})
        if(findParent){
            if(!req.body.preferredName){
                req.body.preferredName = req.body.firstName
            }
            // console.log(req.file)
            // console.log(req.body)
           let data = {
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
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
            console.log(createChild)
            res.redirect('/user')
        }
    }catch(err){
        next(err)
    }
})

//GET SHOW ROUTE
router.get('/:id/child', async (req,res,next) => {
    try{
        const child = await Child.findOne({_id:req.params.id})
        res.render('children/show', {child})
    }catch(err){
        next(err)
    }
})

//PUT EDIT ROUTE
router.put('/:id/child',upload.single('profilePicture'), async(req,res,next) => {
    try{
        // console.log(req.body)
        console.log(req.file)
        console.log(req.body)
        if(req.body.deleteCurrent){
           await cloudinary.uploader.destroy(req.body.deleteCurrent)
        }
        let data = {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            nickname: req.body.nickname,
            birthDay: req.body.birthDay,
            birthMonth:req.body.birthMonth,
            birthYear: req.body.birthYear,
            childEmail: req.body.childEmail,
            preferredName: req.body.preferredName,
        }  
        if(req.file){
            data = {...data, profilePicture:{url:req.file.path, filename: req.file.filename}}
        }
        console.log(data)
        const childToEdit = await Child.findOneAndUpdate({_id:req.params.id},[{data}, {$push:{addOns: {prompt: req.body.promptChoice, response: req.body.choiceResponse}}}], {new:true})
        res.redirect(`/user/${childToEdit._id}/child`)
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

//DELETE ROUTE
router.delete('/:id ', async (req,res, next) => {
   try{
       const deletedChild = await Child.findByIdAndRemove(req.params.id)
        if(deletedChild){
            res.redirect('/user')
        }
    }catch(err){
      next(err)
    }
})

module.exports = router