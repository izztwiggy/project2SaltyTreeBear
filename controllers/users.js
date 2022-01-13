const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Child = require('../models/children')
const session = require('express-session')

//  '/user/

//GET : HOME ROUTE 
router.get('/', async (req,res,next) =>{
   try{
        const currentUser = await User.findOne({username: req.session.username})
        const userChildren = await Child.find({parent: currentUser._id})
        if(userChildren){
            console.log(userChildren)
            res.render('users/index', {user:currentUser, children:userChildren})
        } 
   }catch(err){
       next(err)
   }
})

router.get('/update', (req,res) => {
    res.render('users/setup')
})

router.put('/update', async(req,res,next) => {
    try{
        if(!req.body.profilePicture){
            req.body.profilePicture = req.body.avatar
        }
        if(req.body.annualEmail === 'on'){
            req.body.annualEmail = true
        }
        if(req.body.partnerEmail){
            req.body.partner = true
        }
        const sessionUser = await User.findOneAndUpdate({username: req.session.username},{name: req.body.name, email: req.body.email, profilePicture:req.body.profilePicture, annualEmail: req.body.annualEmail, partner: req.body.partner, partnerEmail: req.body.partnerEmail}, {new:true})
        if(sessionUser){
           console.log(sessionUser)
           res.redirect('/user/child/new')
        }
    }catch(err){
        next(err)
    }
})

router.get('/edit', async(req,res,next) => {
    try{
        const user = await User.findOne({username:req.session.username})
        res.render('users/edit', {user})
    }catch(err){
        next(err)
    }
})

router.put('/edit', (req,res) => {
    console.log(req.body)
        if(req.body.avatarProfile){
            req.body.profilePicture = req.body.avatarProfile
        }
        if(req.body.annualEmail === 'on'){
            req.body.annualEmail = true
        }
        if(req.body.partnerEmail){
            req.body.partner = true
        }
        const updateInfo = {
            name: req.body.name,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            annualEmail: req.body.annualEmail,
            partnerEmail: req.body.partnerEmail
        }
        User.findOneAndUpdate({username: req.session.username},req.body, {new:true},(err, updatedUser) => {
            if(err){
                console.log(err)
                req.session.message = 'Unable to edit, please try again'
            } else {
                console.log(updatedUser)
                res.redirect('/user')
            }
        })
})

router.get('/child/new', (req,res) => {
    res.render('children/add')
})
router.post('/', async (req,res,next) => {
    try{
        console.log(req.body)
        const findParent = await User.findOne({username: req.session.username})
        if(findParent){
            if(!req.body.preferredName){
                req.body.preferredName = req.body.firstName
            }
            const data = {...req.body, parent: findParent._id}
            const createChild = await Child.create(data)
            await createChild.save()
            console.log(createChild)
            res.redirect('/user')
        }
    }catch(err){
        next(err)
    }
})

router.get('/:id/child', (req,res) => {
    res.render('children/view')
})

router.put('/:id/child', async(req,res,next) => {
    try{
        console.log(req.body)
        const childToEdit = await Child.findByIdAndUpdate(req.params.id, req.body)
        if(childToEdit){
            console.log('updated child')
            console.log(childToEdit)
            res.redirect(`/user/${childToEdit._id}/child`)
        }
    }catch(err){
        next(err)
    }
})

router.get('/:id/child/edit', (req,res) => {
    res.render('children/edit')
})

module.exports = router