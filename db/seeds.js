const mongoose = require('./connection')
const User = require('../models/user')
const Bookshelf = require('../models/bookshelf')
const Calendar = require('../models/calendar')
const Child = require('../models/child')

Bookshelf.deleteMany({})
    .then(() => {
        return User.insertMany(bookSeeds)
    })
    .then(data => console.log(data))
    .catch(err => console.log(err))
    .finally(() => {
        process.exit()
    }) 