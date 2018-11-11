const express = require('express')
const router = express.Router()


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Games were fetched'
    })
})

router.post('/', (req, res, next) => {
    console.log(req.body.gameId)
    const game = {
        gameId: req.gameId,
    }
    res.status(201).json({
        message: 'Games were created',
        game: game,
    })
})

router.get('/:gameId', (req, res, next) => {
    res.status(200).json({
        message: 'Games deets',
        gameId: req.params.gameId
    })
})

router.delete('/:gameId', (req, res, next) => {
    res.status(200).json({
        message: 'game deleted',
        gameId: req.params.gameId,
    })
})


module.exports = router; //exports all the routes