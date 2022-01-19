const mongoose = require('mongoose')

const mongoURI =
  //check if the node environment is production
  process.env.NODE_ENV === 'production'
    ? process.env.DB_URL
    : process.env.MONGO_URI
     

mongoose.connect(mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(instance => console.log(instance.connections[0].name))
.catch(err => console.error(err))


module.exports = mongoose