require('dotenv').config()
const express = require('express')
const app = express()

const SESSION_SECRET = process.env.SESSION_SECRET

// const path = require('path')
// const cors = require('cors')
// const fs = require('fs')
const methodOverride = require('method-override')
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')

const bookController = require('./controllers/books')
const calendarController = require('./controllers/calendars')
const userController = require('./controllers/users')
const sessionController = require('./controllers/sessions')

app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(ejsLayouts)
app.set('view engine', 'ejs')

//MIDDLEWARE

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use((req,res,next) => {
    res.locals.username = req.session.username
    res.locals.loggedIn = req.session.loggedIn
    next()
})

app.use((req,res, next) => {
    res.locals.message = req.session.message
    req.session.message = ''
    next()
})

const authRequired = (req,res, next) => {
    if(req.session.loggedIn){
        next()
    } else {
        res.redirect('/session/login')
    }
}

app.use('/session', sessionController)
app.use('/user', authRequired, userController)
app.use('/bookshelf', bookController)
app.use('/calendar', calendarController)

app.set('port', process.env.PORT || 8000);
app.listen(app.get('port'), () => {
    console.log(`PORT: ${app.get('port')}`)
})
