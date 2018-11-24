const mongoose = require('mongoose');

//the shema defines how the object should look
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true},
  elo: Number
})

//the model wraps it and provides you some methods to build it
module.exports = mongoose.model('User', userSchema)