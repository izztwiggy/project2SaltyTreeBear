const mongoose = require('mongoose')
const mongoURI = process.env.MONGOURI

mongoose.connect(mongoURI, {
    useNewUrlParser:true,
    useUnifiedTopology: true
})
    .then(isntance => console.log(isntance.connections[0].name, 'connected to DB'))
    .catch(err => console.error(err))

module.exports = mongoose