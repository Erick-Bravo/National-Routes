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
  if (visited)
    visited.forEach(park => {
        park = park.toJSON();
        const user = {username: park.User.username, userId: park.User.id};
        park.Reviews.forEach(review => {
          review.user = user;
          reviews.push(review);
        })
    });

    reviews.sort((a,b) => {
      if (a.createdAt < b.createdAt) return 1
      else if (a.createdAt > b.createdAt) return -1
      else return 0
    });

  console.log("================", reviews, "================");

  const user = await getUserFromSession(req);
  res.render('park-page', { park, state, title: park.name, token: req.csrfToken(), reviews, user });

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

//TEMPORARY CHECKS SESSION
router.get("/sessionCheck", (req, res) => {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + req.session.views + '</p>');
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
    res.end();
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!');
  };
});



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
