require('dotenv').config()
const express = require('express')
const app = express()

const path = require('path')
const cors = require('cors')
const fs = require('fs')

const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const session = require('express-session')

const methodOverride = require('method-override')
const ejsLayouts = require('express-ejs-layouts')

const port = process.env.PORT

const bookshelvesController = require('./controllers/bookshelves')
const calendarsController = require('./controllers/calendars')
const usersController = require('./controllers/users')
const sessionsController = require('./controllers/sessions')

app.use(ejsLayouts)
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

//session middleware

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

//intialize passport, initialize and passport.session() to use passport for sessions
app.use(passport.initialize())
app.use(passport.session())



//                                          MIDDLEWARE

app.use((req,res, next) => {
    res.locals.message = req.session.message
    req.session.message = ''
    next()
})

app.use((req,res,next) => {
    res.locals.username = req.session.username
    res.locals.loggedIn = req.session.loggedIn
    next()
})

//    CONTROLLER ROUTE SETTERS
app.use('/user', usersController)
app.use('/bookshelf', bookshelvesController)
app.use('/session', sessionsController)
app.use('/calendar', calendarsController)

app.listen(port,() => console.log('Listening on the Port'))
