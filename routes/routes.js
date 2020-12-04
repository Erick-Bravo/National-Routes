//importing modules
const express = require("express");

//importing local files
const db = require("../db/models");
const { environment } = require("../config");
const { asyncHandler, csrfProtection, getUserFromSession, checkAuth } = require("./utiles");
const { route } = require("./authentication");

//defining global variables and helper functions
const router = express.Router();

// custom routes list helper function
const getCustomRoutes = async req => {
  const userId = parseInt(req.session.auth.userId);
  let routes = await db.Route.findAll({
    where: {
      userId
    },
    order: [["name", "ASC"]]
  });
  if (routes) {
    routes = routes.map(route => route.toJSON());
  } else {
    routes = false;
  }

  return routes;
}

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
  const user = await getUserFromSession(req);
  res.render('park-page', { park, state, title: park.name, token: req.csrfToken(), reviews, user });

}));

// // MY ROUTES



router.get("/my-routes", checkAuth, asyncHandler(async (req, res) => {
    const id = parseInt(req.session.auth.userId);
    let user = await db.User.findOne({
        where: { id },
        include: db.Park
    });

    let routes = await getCustomRoutes(req)
    console.log('ROUTES!!!!!!!!!', routes)

    user = await user.toJSON()
    res.render("my-routes", {title: 'MY ROUTES', parks: user.Parks, routes, user: {userId: user.id, username: user.username} })
}))

// ADD CUSTOM ROUTE FORM PAGE
router.get("/my-routes/add", checkAuth, csrfProtection, asyncHandler(async (req, res) => {
    const parks = await db.Park.findAll();

    res.render("create-new-route", {title: "CREATE NEW ROUTE",  parks, token: req.csrfToken() })

}))

// Create New Route
// check auth????
router.post("/my-routes/add", csrfProtection, asyncHandler( async(req, res) => {
    const { newRoute, parkItem } = req.body;

  // grab user from session
    // can also look for parkId
    const id = parseInt(req.session.auth.userId);
    let user = await db.User.findOne({
      where: { id },
      include: db.Park,
    });

    // create record in Routes table with userId and new route name & assign to variable (route)
    const route = await db.Route.create({
      name: newRoute,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    //iterate through park list (req.body.parkItem)
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', parkItem)
    parkItem.forEach(async(park) => {
      let parkId = parseInt(park);
      await db.RoutesPark.create({
        routeId: route.id,
        parkId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    })



        // forEach element parseInt to get parkId
        // create record for RoutesParks with parkId and routeId ^^ access route.id;
    res.redirect("/my-routes")
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



//exporting router
module.exports = router;
