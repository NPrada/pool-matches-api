const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /users'
    })
})

router.post('/', (req, res, next) => {
    const user = {
        name: req.body.name,
    };

    res.status(201).json({
        message: 'Handling POST requests to /users',
        createdUser: user
    })
})

router.get('/:userId', (req, res, next) =>{
    const id = req.params.userId

    if (id === 'special'){
        res.status(200).json({
            message:'You discovered the special ID',
            id: 'special'
        })
    }else {
        res.status(200).json({
            message: 'You passed an ID'
        })
    }
})


router.patch('/:userId', (req, res, next) =>{
   res.status(200).json({
       message: 'Updated User!'
   })
})

router.delete('/:userId', (req, res, next) =>{
    res.status(200).json({
        message: 'Deleted User!'
    })
})

module.exports = router; //exports all the routes