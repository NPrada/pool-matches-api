const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const User = require('../models/user') //import the user model that allows me to interact with the db

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then( docs =>{
            console.log(docs)
            res.status(200).json(docs)
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

    //mongoouse stores this model in the db with save()
    user
        .save()
        .then(result =>{
            console.log(result)
            res.status(201).json({
                message: 'Handling POST requests to /users',
                createdUser: result
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
        .exec()
        .then(doc => {
            console.log('From db', doc)
            if(doc){
                res.status(200).json(doc)
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