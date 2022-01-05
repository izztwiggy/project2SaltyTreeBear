require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

//come back and will require controllers here

const mongoose = require('mongoose')
const ejsLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

const routeHitter = (req,res,next) => {
    console.log('A new route has been hit')
    next()
}

app.use(routeHitter)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(ejsLayouts)
app.set('view engine', 'ejs')

//app.use(//set your path export here and controller)


app.listen(port,() => {
    console.log('Listening on the Port')
})

