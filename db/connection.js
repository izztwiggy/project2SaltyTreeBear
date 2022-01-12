const mongoose = require('mongoose')
const mongo_URI = process.env.MONGO_URI

mongoose.connect(mongo_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(instance => console.log(instance.connections[0].name))
.catch(err => console.error(err))

module.exports = mongoose