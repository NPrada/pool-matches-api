const mongoose = require('mongoose');


//the shema defines how the object should look
const teams = mongoose.Schema({
    team1:[ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
    team2:[ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ],
})

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teams: teams,
    date: {type: String, required: true},

})

//the model wraps it and provides you some methods to build it
module.exports = mongoose.model('Game', userSchema)