const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Child = require('../models/children')

//  '/user/

//GET : HOME ROUTE 
router.get('/', async (req,res,next) =>{
    try{
        const currentUser = await User.findOne({username:req.session.username})
        if(currentUser){
            const foundChildren = await Child.find({parent:currentUser._id})
            .populate('user')
            if(foundChildren){
                res.render('users/index', {user:currentUser, children:foundChildren})
            }
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
        console.log(req.body)
        if(!req.body.profilePicture){
            const profilePicture = req.body.avatar
        }
        if(req.body.annualEmail === 'on'){
            req.body.annualEmail = true
        }
        if(req.body.partnerEmail){
            req.body.partner = true
        }
        const foundUser = await User.findOneAndUpdate({username: req.session.username}, {...foundUser, name: req.body.name, email: req.body.email, profilePicture: profilePicture, annualEmail: req.body.annualEmail, partner: req.body.partner, partnerEmail: req.body.partnerEmail})
        if(foundUser){
            console.log(foundUser)
            res.redirect('/user/child/new')
        }
    }catch(err){
        next(err)
    }
})

router.get('/edit', (req,res) => {
    res.render('users/edit')
})

router.put('/edit', async(req,res,next) => {
    try{
        console.log(req.body)
        const currUser = await User.findOneAndUpdate({username: req.session.username}, req.body)
        if(currUser){
            console.log('Updated')
            console.log(currUser)
            res.redirect('/user')
        }
    }catch(err){
        next(err)
    }
})

router.get('/child/new', (req,res) => {
    res.render('children/add')
})
router.post('/child/new', async(req,res,next) => {
    try{
        console.log(req.body)
        const findParent = await User.findOne({username: req.session.username})
        if(findParent){
            const createdChild = await Child.create({...req.body, parent: findParent._id})
            console.log(createdChild)
            res.redirect('/user')
        }
    }catch(err){
        next(err)
    }
})

router.get('/:id/child', (req,res) => {
    res.render('children/view')
})

router.get('/:id/child/edit', (req,res) => {
    res.render('children/edit')
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

module.exports = router