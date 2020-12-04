//importing modules
const express = require("express");
const { Op } = require('sequelize');

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

//   // FULL PARKS LIST
// router.get('/parks', asyncHandler(async (req, res) => {
//   const parks = await db.Park.findAll();
//   res.render('park-list-full', { title: 'NATIONAL ROUTES', parks });
// }));

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
router.get("/my-routes", checkAuth, csrfProtection, asyncHandler(async (req, res) => {
    const id = parseInt(req.session.auth.userId);
    let user = await db.User.findOne({
        where: { id },
        include: db.Park,
    });

    user = await user.toJSON()

    res.render("my-routes", {title: 'MY ROUTES', parks: user.Parks, user: {userId: user.id, username: user.username}, token: req.csrfToken() })
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

//TEAM
router.get("/team", csrfProtection, (req, res) => {
  const user = req.session.auth?req.session.auth:false;
  res.render("team", {title: "Team", user, token: req.csrfToken()});
})

//SEARCH
router.post("/search", csrfProtection, asyncHandler(async (req, res) => {
  let { searchStr } = req.body;
  searchStr = searchStr.replace(/[^\w\s]/ig,"").replace(/\s+/ig, " ").trim();

  let states = await db.State.findAll({where:{
    name: {
      [Op.iLike]: `%${searchStr}%`
    }},
    include: db.Park});

  if (states) {
    states = states.map(state => state.toJSON()).filter(state => {
      return (state.Parks.length > 0);
    })
  }

  if (!states) {
    states = false;
  }

  let parks = await db.Park.findAll({where:{
    name: {
      [Op.iLike]: `%${searchStr}%`
    }
  }});
  if (parks) {
    parks = parks.map(park => park.toJSON());
  } else {
    parks = false;
  }

  if (parks.length === 1) {
    res.redirect(`/parks/${parks[0].id}`);
  }else {
    res.render('search',{title:`Search for "${searchStr}":`,token: req.csrfToken(), states, parks})
  }

}))

router.get("/search/state/:id(\\d+)", csrfProtection, asyncHandler(async (req, res) => {
  const stateId = parseInt(req.params.id);
  let state = await db.State.findOne({
    where: {id: stateId},
    include: [db.Park]
  });
  state = state.toJSON();
  let parks = false
  if (state.Parks.length) parks = state.Parks

  res.render('search',{title:`Search by state: ${state.name}`,token: req.csrfToken(), parks})
}));

// Review

router.post("/reviews", csrfProtection, asyncHandler(async(req, res) => {
  const { parkId, text } = req.body

  const user = await getUserFromSession(req)

  const userId = user.userId
  // let visited = await db.Visited.findOne({ where: { parkId, userId } })
  let visited = await db.Visited.findAll()
  if (!visited) {
    visited = await db.Visited.create({
      userId,
      parkId
    })
  }
  const visitedId = visited.toJSON().id
  await db.Review.create({
    visitedId,
    text
   })
   res.redirect(`/parks/${ parkId }`)
}))


router.get("/reviews/delete/:id(\\d+)", asyncHandler(async(req, res) => {
  const id = parseInt(req.params.id)
  const review = await db.Review.findByPk( id, { include: db.Visited  })
  const parkId = review.Visited.parkId
  if(review.Visited.userId === req.session.auth.userId) {
    await review.destroy()
  }
   res.redirect('/parks/' + parkId);
}))


router.post("/reviews/edit/:id(\\d+)", asyncHandler(async(req, res) => {
  const id = parseInt(req.params.id)
  const review = await db.Review.findByPk( id, { include: db.Visited } )
  const parkId = review.Visited.parkId

  const { text } = req.body
  if(review.Visited.userId === req.session.auth.userId) {
    await review.update({
      text
    })
  }
  res.redirect(`/parks/${ parkId }`)
}))




//exporting router
module.exports = router;
