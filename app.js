const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')

const usersRoutes = require('./api/routes/users');
const gamesRoutes = require('./api/routes/games');

//middleware to use before going to the routes
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//CORS stuff
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*') //allow acess to anyone
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    //if the browser sens an options request asking what is it allowed to ask for so return valid response
    if (req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next() //always return next so the other routes can take over
})

//routes which handle requests
app.use('/users', usersRoutes)
app.use('/games', gamesRoutes)

app.use('/', (res, req, next) =>{
    const error = new Error('Not Found')
    error.status = 404
    next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500)
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app;