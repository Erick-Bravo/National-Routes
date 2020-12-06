//importing modules
const express = require('express');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require("path");


//importing local files
const router = require('./routes/routes.js');
const authRouter = require("./routes/authentication.js")
const { sequelize } = require('./db/models');
const { environment, secret, sessionMaxAge} = require('./config');
const store = new SequelizeStore({ db: sequelize });
const sessionSettings = {
    secret,
    store,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: sessionMaxAge,
        // secure: true
    }
};

// create Session table if it doesn't already exist
store.sync();

//creating server
const app = express();

//server settings
app.set('view engine', 'pug');

//entry points
app.use(session(sessionSettings));  //setting a session
app.use(morgan('dev'));             //request logs in terminal
app.use(express.json());
app.use(express.urlencoded({ extended: true }));     //all req.body encoded
app.use(cookieParser());            //cookie-check
app.use(router);                    //sending request to check on router
app.use(express.static('public'));
app.use(authRouter);

//error handlers
//if none of the routes and methodes matched - create 404 error
app.use((req, res, next)=>{
    const error = new Error('The requests page could not be found.');
    error.status = 404;
    next(error);
});

//log error in terminal
app.use((err, req, res, next) => {
    console.error(err);
    next(err);
});

//render error page
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    const user = req.session.auth;

    const status = err.status || 500;
    res.redirect("/error/"+ status);
});


//export app
module.exports = app;
