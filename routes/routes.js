//importing modules
const express = require("express");

//importing local files
const db = require("../db/models");
const { environment } = require("../config");
const { asyncHandler, csrfProtection, getUserFromSession, checkAuth } = require("./utiles");
const { route } = require("./authentication");

//defining global variables and helper functions
const router = express.Router();

// router.use(express.static('public'));

// entry points like:
    //HOMEPAGE
router.get("/", csrfProtection, asyncHandler(async (req, res) => {
    const parks = await db.Park.findAll(); //maybe order the list by average rating.
    const user = await getUserFromSession(req);
    res.render('park-list', {title: 'NATIONAL ROUTES', parks, token: req.csrfToken(), user})
}));

  // FULL PARKS LIST
router.get('/parks', asyncHandler(async (req, res) => {
  const parks = await db.Park.findAll();
  res.render('park-list-full', { title: 'NATIONAL ROUTES', parks });
}));

  //INDIVIDUAL PARK
router.get('/parks/:id', csrfProtection, asyncHandler(async (req, res) => {
  const parkId = parseInt(req.params.id);
  let park = await db.Park.findByPk(parkId, {
    include: db.State
  });

  park = await park.toJSON();
  const state = park.States.map(state => state.name).join(", ");

  let visited = await db.Visited.findAll({
    where: {parkId},
    include: [db.User, db.Review]
  });

  let reviews = [];
  let rates =[];

  if (visited) {
    visited.forEach(park => {
      park = park.toJSON();
      if(park.rate){
        rates.push(park.rate);
      }
      const user = {username: park.User.username, userId: park.User.id};
      park.Reviews.forEach(review => {
        review.user = user;
        reviews.push(review);
      })
    });
  }

  reviews.sort((a,b) => {
    if (a.createdAt < b.createdAt) return 1
    else if (a.createdAt > b.createdAt) return -1
    else return 0
  });

  const user = await getUserFromSession(req);
  //average rating for park
  let rateAvg = false;
  if (rates.length){
    rateAvg = rates.reduce((sum, rate) => sum + parseInt(rate), 0.0)/rates.length;
  }
  //if park was visited
  let isVisited = false;
  //if park was rated
  let userRate = null;
  if (user) {
    userRate = await db.Visited.findOne({
      where: {
        userId: parseInt(user.userId),
        parkId
      }
    });
    if (userRate) {
      isVisited = true;
      userRate = userRate.toJSON().rate;
    }
  }

  res.render('park-page', {
    park, state, title: park.name,
    token: req.csrfToken(), reviews, user,
    isVisited, rate:{userRate, rateAvg, ratedBy:rates.length} });

}));

// // MY ROUTES

router.get("/my-routes", checkAuth, asyncHandler(async (req, res) => {
    const id = parseInt(req.session.auth.userId);
    let user = await db.User.findOne({
        where: { id },
        include: db.Park,
    });

    user = await user.toJSON()
    console.log(user.Parks[0])
    res.render("my-routes", {title: 'MY ROUTES', parks: user.Parks, user: {userId: user.id, username: user.username} })
}))

//RATE PARK/ADD TO VISITED
router.get("/visited/:parkId(\\d+)/rate/:rate(\[12345\])", asyncHandler(async (req, res) => {
  if (!req.session.auth) {
    return res.redirect("/")
  } else {
    const parkId = parseInt(req.params.parkId);
    const rate = parseInt(req.params.rate);
    const userId = parseInt(req.session.auth.userId);

    const visited = await db.Visited.findOne({
      where: {
        userId,
        parkId
      }
    })

    if (visited) {
      await visited.update({ rate });;
    } else {
      await db.Visited.create({
        userId,
        parkId,
        rate
      })
    }
    res.redirect(`/parks/${parkId}`);
  }

}));

//exporting router
module.exports = router;
