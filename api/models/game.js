const mongoose = require('mongoose');


const gameSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  teams: {
    team1: [{name: {type: String, required: true},_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}} ],
    team2: [{name: {type: String, required: true},_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User' }} ],
  },
  winner: {type: String, enum: ['team1', 'team2'], required: true},
  date: {type: String, required: true},

})
//team1: [{name: {type: 'string', by:mongoose.Schema.Types.ObjectId },  _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}}],

//the model wraps it and provides you some methods to build it
module.exports = mongoose.model('Game', gameSchema)