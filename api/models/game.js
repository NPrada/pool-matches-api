const mongoose = require('mongoose');


const gameSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  teams: {
    team1: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    team2: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  },
  winner: {type: String, enum: ['team1', 'team2'], required: true},
  date: {type: String, required: true},

})

//the model wraps it and provides you some methods to build it
module.exports = mongoose.model('Game', gameSchema)