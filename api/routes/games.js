const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Game = require('../models/game');
const User = require('../models/user')

const getDate = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  return dd + '-' + mm + '-' + yyyy;
}

//TODO make a function that will update users win% and game count on game post/patch

router.get('/', (req, res, next) => {

  Game.find()
    .select('-__v')
    .then(docs => {
      const response = {
        count: docs.length,
        games: docs,
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})

    })
})

router.post('/', (req, res, next) => {

  const allIds = req.body.teams.team1.concat(req.body.teams.team2)

  if (!allIds.every(value => {
    return typeof value !== 'undefined'
  })) {
    new Error('One or both teams didn\'t have any players')
  } else if (allIds.length === 0) {
    new Error('No players were provided')
  } else {

    const idsToCheck = allIds.map(playerObj => {
      return playerObj._id;
    })

    User.find({'_id': {$in: idsToCheck}})
      .then(idsValid => {
        if (!idsValid) {
          return res.status(404).json({error: 'Some players dont exist'})
        } else {
          const game = new Game({
            _id: new mongoose.Types.ObjectId(),
            teams: req.body.teams,
            date: getDate(),
          });
          return game.save();
        }

      })
      .then(result => {
        console.log(result)
        res.status(201).json({
          message: 'Created game successfully',
          createdGame: {
            _id: result._id,
            teams: result.teams,
            date: result.date,
            request: {
              type: 'POST',
              url: 'http:localhost:3550/games/' + result._id
            }
          }
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({success: false, error: err})

      })
  }
})

router.patch('/:gameId', (req, res, next) => {
  const id = req.params.gameId;

  const allIds = req.body.teams.team1.concat(req.body.teams.team2)

  if (!allIds.every(value => {
    return typeof value !== 'undefined'
  })) {
    res.status(404).json({success: false, error: "One or both teams didn't have any players"})
  } else if (allIds.length === 0) {
    res.status(404).json({success: false, error: "No players were provided"})
  } else {

    const idsToCheck = allIds.map(playerObj => {
      return playerObj._id;
    })

    User.find({'_id': {$in: idsToCheck}})
      .then(idsValid => {
        if (!idsValid) {
          return res.status(404).json({error: 'Some players dont exist'})
        }
        const newTeams = {teams: req.body.teams}
        console.log(req.body.teams)
        return Game.updateOne({_id: id}, {$set: newTeams})
          .exec()
          .then(result => {
            if (result) {
              res.status(200).json(result)
            } else {
              new Error('Got empty response')
            }
          })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({success: false, error: err})

      })
  }
})

router.get('/:gameId', (req, res, next) => {

  const id = req.params.gameId;

  Game.findById(id)
    .select('-__v')
    .exec()
    .then(doc => {
      console.log('From db', doc)
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({message: 'no valid entry for the id provided'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})

    })

})

router.delete('/:gameId', (req, res, next) => {

  const id = req.params.gameId
  Game.deleteOne({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({response: result})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})

    })
})


module.exports = router; //exports all the routes