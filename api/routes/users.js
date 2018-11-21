const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const User = require('../models/user') //import the user model that allows me to interact with the db
const Game = require('../models/game');

router.get('/', (req, res, next) => {
    User.find()
        .select('-__v') //select what data you actually fetch in this case everything aside from __v
        .exec()
        .then( docs =>{
            const response ={
                count: docs.length,
                users: docs.map(doc =>{
                    return {
                        name: doc.name,
                        _id: doc._id,
                        request:{
                            type: 'GET',
                            url: 'http:localhost:3550/users/' + doc._id,
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch( err =>{
            console.log(err)
            res.send(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
    })

    //mongoose stores this model in the db with save()
    user
        .save()
        .then(result =>{
            console.log(result)
            res.status(201).json({
                message: 'Created user successfully',
                createdUser: {
                    _id: result._id,
                    name: result.name,
                    request: {
                        type: 'POST',
                        url: 'http:localhost:3550/users/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })


})

router.get('/:userId', (req, res, next) =>{
    const id = req.params.userId

    User.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            //console.log('From db', doc)
            if(doc){
                let response = doc.toJSON();

                console.log( response)
                const updateOps = {}

                // send an object with the fields you wish to change
                for (const key of Object.keys(doc)) {
                    updateOps[key] = doc[key]
                }
                Game.find( {$or: [ {"teams.team2": id }, {"teams.team1": id } ]})
                    .select('-__v')
                    .exec()
                    .then(games => {
                        response.games = games;
                        console.log('From db', response)
                        res.status(200).json(response)
                    })

            }else {
                res.status(404).json({message: 'no valid entry for the id provided'})
            }

        })
        .catch(err =>{
            console.log(err)
            res.status(500).json({error: err})
        })
})


router.patch('/:userId', (req, res, next) =>{
    const id = req.params.userId;
    const updateOps = {}

    // send an object with the fields you wish to change
    for (const key of Object.keys(req.body)) {
        updateOps[key] = req.body[key]
    }

    User.updateOne({_id: id}, { $set: updateOps })
        .exec()
        .then( result =>{
            res.status(200).json(result)
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) =>{
    const id = req.params.userId
    console.log(id)
    User.deleteOne({_id: id})       //or use deleteMany
        .exec()
        .then( result =>{
            res.status(200).json(result)
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router; //exports all the routes