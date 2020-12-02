//importing modules
const express = require("express");

//importing local files
const db = require("../db/models");
const { environment } = require("../config");
const { asyncHandler, csrfProtection } = require("./utiles")


//defining global variables and helper functions
const router = express.Router();

// entry points like:
    //HOMEPAGE
router.get("/", csrfProtection, asyncHandler(async (req, res) => {
    const parks = await db.Park.findAll(); //maybe order the list by average rating.
    res.render('park-list', {title: 'NATIONAL ROUTES', parks, token: req.csrfToken()})

}));

//TEMPORARY CHECKS SESSION
router.get("/sessionCheck", (req,res) => {
  if (req.session.views) {
      req.session.views++
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>views: ' + req.session.views + '</p>')
      res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      res.end()
    } else {
      req.session.views = 1
      res.end('welcome to the session demo. refresh!')
    }
})
//exporting router
module.exports = router;
