//importing modules
const express = require('express');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const session = require('express-session');

//importing local files
const router = require('./routes.js');
const { environment, sessionSettings} = require('./config');


//creating server
const app = express();

//server settings
app.set('view engine', 'pug');


//entry points
app.use(session(sessionSettings));  //setting a session
app.use(morgan('dev'));             //request logs in terminal
app.use(express.urlencoded({ extended: true }));     //all req.body encoded
app.use(cookieParser());            //cookie-check
app.use(router);                    //sending request to check on router

//error handlers
//if none of the routes and methodes matched - create 404 error
app.use((req, res, next)=>{
    const error = new Error('The requests page could not be found.');
    error.status = 404;
    next(error);
});

//render page for 404 error, else pass to generic error handler
app.use((err, req, res, next) => {
    if (err.status === 404){
        res.status(404);
        res.render('page-not-found', {title: 'Page Not Found'});
    } else {
        next(err);
    }
});

//log error in terminal
app.use((err, req, res, next) => {
    console.error(err);
    next(err);
});

//render error page for other errors
app.use((err, req, res, next) => {
    if (environment === "production") {
        err.message = null,
        err.stack = null
    }
    res.status(err.status);
    res.render('error', {title: 'Server Error', err} )
});

//export app
module.exports = app;
