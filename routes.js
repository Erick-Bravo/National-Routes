//importing modules
const express = require("express");
const csrf = require("csurf");

//importing local files
const db = require("./db/models");
const { environment } = require("./config");

//defining global variables and helper functions
const router = express.Router();
const asyncHandler = (handler) =>
(req, res, next) => handler(req, res, next).catch(next);
const csrfProtection = csrf({cookie: true});

// entry points like:
    //HOMEPAGE
router.get("/", asyncHandler(async (req, res) => {
    const parks = await db.Park.findAll(); //maybe order the list by average rating.
    res.render('park-list', {title: 'National Parks in United States', parks})
    // if (!req.session.count) req.session.count = 0;

    // req.session.count++;

    // res.send({count: req.session.count});
}));

//exporting router
module.exports = router;
