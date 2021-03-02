//importing modules
const { next } = require("cli");
const express = require("express");
const { Op } = require('sequelize');
const { sequelize } = require("../db/models");

//importing local files
const db = require("../db/models");
const { asyncHandler, csrfProtection, getUserFromSession, checkAuth } = require("./utiles");

//defining global variables and helper functions
const router = express.Router();
//parkId is optional, to check if this park in the route
const getCustomRoutes = async (req, parkId) => {
  const user = await getUserFromSession(req);
  if (user) {
    let routes = await db.Route.findAll({
      where: {
        userId: user.userId
      },
      order: [["name", "ASC"]]
    });
    if (routes) {
      routes = routes.map(route => route.toJSON());
      if (parkId) {
        for (let i = 0; i < routes.length; i++) {
          let routesPark = await db.RoutesPark.findOne({
            where: {
              parkId,
              routeId: routes[i].id
            }
          });
          if (routesPark) routes[i].isParkInRoute = true;
        };
      };
    } else {
      routes = [];
    };
    return routes;
  } else {
    return false;
  };
};

const getCustomRoutesParks = async (req, routeId) => {
  const userId = parseInt(req.session.auth.userId);
  let routesParks = await db.Route.findByPk(routeId, {
    include: db.Park
  });

  if (routesParks) {
    routesParks = routesParks.toJSON();
  } else {
    routesParks = false;
  };
  return routesParks;
};


// entry points like:
//HOMEPAGE
router.get("/", csrfProtection, asyncHandler(async (req, res) => {
  const parks = await db.Park.findAll(); //maybe order the list by average rating.
  const user = await getUserFromSession(req);
  res.render('park-list', { title: 'NATIONAL ROUTES', parks, token: req.csrfToken(), user });
}));

//INDIVIDUAL PARK
router.get('/parks/:id', csrfProtection, asyncHandler(async (req, res) => {
  const parkId = parseInt(req.params.id);
  let park = await db.Park.findByPk(parkId, {
    include: db.State
  });

  park = await park.toJSON();
  const state = park.States.map(state => state.name).join(", ");

  //PARK AVG RATES AND REVIEWS
  let visited = await db.Visited.findAll({
    where: { parkId },
    include: [db.User, db.Review]
  });

  let reviews = [];
  let rates = [];

  if (visited) {
    visited.forEach(park => {
      park = park.toJSON();
      if (park.rate) {
        rates.push(park.rate);
      };
      const user = { username: park.User.username, userId: park.User.id };
      park.Reviews.forEach(review => {
        review.user = user;
        reviews.push(review);
      });
    });
  };

  reviews.sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    else if (a.createdAt > b.createdAt) return -1;
    else return 0;
  });

  const user = await getUserFromSession(req);
  //average rating for park
  let rateAvg = false;
  if (rates.length) {
    rateAvg = rates.reduce((sum, rate) => sum + parseInt(rate), 0.0) / rates.length;
  };
  //if park was visited
  let isVisited = false;
  //if park was rated
  let userRate = null;
  //custom routes if user provided
  let routes = null;
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
    };
    //ROUTES
    routes = await getCustomRoutes(req, parkId);
  };

  res.render('park-page', {
    park, state, title: `${park.name} National Park`,
    token: req.csrfToken(), reviews, user, routes,
    isVisited, rate: { userRate, rateAvg, ratedBy: rates.length }
  });

}));

// // MY ROUTES
router.get("/my-routes", checkAuth, csrfProtection, asyncHandler(async (req, res) => {
  const id = parseInt(req.session.auth.userId);
  let user = await db.User.findOne({
    where: { id },
    include: db.Park
  });

  let routes = await getCustomRoutes(req);

  user = await user.toJSON();

  res.render("my-routes", {
    title: 'MY ROUTES', parks: user.Parks, routes, isMyRoutePage: true,
    user: { userId: user.id, username: user.username }, token: req.csrfToken()
  });
}));

// ADD CUSTOM ROUTE FORM PAGE
router.get("/my-routes/add", checkAuth, csrfProtection, asyncHandler(async (req, res) => {
  const parks = await db.Park.findAll();
  const user = req.session.auth;


  res.render("create-new-route", { title: "CREATE NEW ROUTE", parks, token: req.csrfToken(), user });

}));

// Create New Route
router.post("/my-routes/add", checkAuth, csrfProtection, asyncHandler(async (req, res) => {
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
  });

  //iterate through park list (req.body.parkItem)

  parkItem.forEach(async (park) => {
    let parkId = parseInt(park);
    await db.RoutesPark.create({
      routeId: route.id,
      parkId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  // forEach element parseInt to get parkId
  // create record for RoutesParks with parkId and routeId ^^ access route.id;
  res.redirect("/my-routes");
}));








router.get("/routepark/:routeId(\\d+)/:parkId(\\d+)/delete", checkAuth, csrfProtection, asyncHandler(async (req, res) => {
  const parkId = parseInt(req.params.parkId);
  const routeId = parseInt(req.params.routeId);

  let routePark = await db.RoutesPark.findOne({ where: {
    routeId,
    parkId,
  }});
 
  if(routePark) {
    await routePark.destroy()
  };

  res.redirect(`/my-routes/${routeId}`);
}));




// INDIVIDUAL ROUTES
router.get('/my-routes/:id(\\d+)', checkAuth, csrfProtection, asyncHandler(async (req, res) => {
  let user = req.session.auth;
  let routeId = parseInt(req.params.id);
  let routesParks = await getCustomRoutesParks(req, routeId);

  res.render('custom-route-page', { title: "Here we go again", route: { id: routeId, name: routesParks.name }, routesParks: routesParks.Parks, user, token: req.csrfToken() });
}));

// REMOVE ROUTE
router.get("/my-routes/:id(\\d+)/delete", checkAuth, csrfProtection, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = parseInt(req.session.auth.userId);

  let route = await db.Route.findOne({
    where: {
      id,
      userId
    }
  })

  if (route) {
    await sequelize.transaction(async tx => {
      await db.RoutesPark.destroy({
        where: {
          routeId: id
        }
      }, { transaction: tx });

      await route.destroy({ transaction: tx });
    })
  }

  res.redirect("/my-routes");

}));

//TEMPORARY CHECKS SESSION
router.get("/sessionCheck", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + req.session.views + '</p>');
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
    res.end();
  };
});

//RATE PARK/ADD TO VISITED
router.get("/visited/:parkId(\\d+)/rate/:rate(\[12345\])", checkAuth, asyncHandler(async (req, res) => {
  if (!req.session.auth) {
    return res.redirect("/");
  } else {
    const parkId = parseInt(req.params.parkId);
    const rate = parseInt(req.params.rate);
    const userId = parseInt(req.session.auth.userId);

    const visited = await db.Visited.findOne({
      where: {
        userId,
        parkId
      }
    });

    if (visited) {
      await visited.update({ rate });;
    } else {
      await db.Visited.create({
        userId,
        parkId,
        rate
      })
    };

    if (req.query.visited === 'true') {
      res.redirect("/my-routes")
    } else {
      res.redirect(`/parks/${parkId}`);
    }
  };

}));

router.get("/visited/:parkId(\\d+)/delete", checkAuth, asyncHandler(async (req, res) => {
  const userId = parseInt(req.session.auth.userId);
  const parkId = parseInt(req.params.parkId);

  let visited = await db.Visited.findOne({
    where: {
      parkId,
      userId
    }
  });
  visitedJSON = visited.toJSON();

  await sequelize.transaction(async tx => {
    await db.Review.destroy({
      where: {
        visitedId: visitedJSON.id
      }
    }, { transaction: tx });

    await visited.destroy({ transaction: tx });

  })

  res.redirect("/my-routes");
}));

router.get("/visited/:parkId(\\d+)/clear-rate", checkAuth, asyncHandler(async (req, res) => {
  const userId = parseInt(req.session.auth.userId);
  const parkId = parseInt(req.params.parkId);

  let visited = await db.Visited.findOne({
    where: {
      parkId,
      userId
    }
  });

  await visited.update({
    rate: null
  })

  res.redirect("/my-routes");
}));
//TEAM
router.get("/team", csrfProtection, (req, res) => {
  const user = req.session.auth ? req.session.auth : false;
  res.render("team", { title: "Team", user, token: req.csrfToken() });
});

//SEARCH
router.post("/search", csrfProtection, asyncHandler(async (req, res) => {
  let { searchStr } = req.body;
  searchStr = searchStr.replace(/[^\w\s]/ig, "").replace(/\s+/ig, " ").trim();

  let states = await db.State.findAll({
    where: {
      name: {
        [Op.iLike]: `%${searchStr}%`
      }
    },
    include: db.Park
  });

  if (states) {
    states = states.map(state => state.toJSON()).filter(state => {
      return (state.Parks.length > 0);
    });
  };

  if (!states) {
    states = false;
  };

  let parks = await db.Park.findAll({
    where: {
      name: {
        [Op.iLike]: `%${searchStr}%`
      }
    }
  });

  if (parks) {
    parks = parks.map(park => park.toJSON());
  } else {
    parks = false;
  };

  if (parks.length === 1) {
    res.redirect(`/parks/${parks[0].id}`);
  } else {
    const user = req.session.auth
    res.render('search', { title: `Search for "${searchStr}":`, token: req.csrfToken(), states, parks, user });
  };

}));

router.get("/search/state/:id(\\d+)", csrfProtection, asyncHandler(async (req, res) => {
  const stateId = parseInt(req.params.id);
  let state = await db.State.findOne({
    where: { id: stateId },
    include: [db.Park]
  });

  state = state.toJSON();

  let parks = false;

  if (state.Parks.length) parks = state.Parks;

  const user = req.session.auth;
  res.render('search', { title: `Search by state: ${state.name}`, token: req.csrfToken(), parks, user })
}));

//ADD/DELETE PARK TO THE ROUTE FROM PARK PAGE
router.get("/parks/:parkId(\\d+)/route/:routeId(\\d+)", asyncHandler(async (req, res) => {
  const parkId = parseInt(req.params.parkId);
  const routeId = parseInt(req.params.routeId);

  const routesPark = await db.RoutesPark.findOne({
    where: {
      parkId,
      routeId
    }
  });

  if (routesPark) {
    await routesPark.destroy();
  } else {
    await db.RoutesPark.create({
      parkId,
      routeId
    })
  }
  res.redirect(`/parks/${parkId}`);
}))
// Review

router.post("/reviews", checkAuth, csrfProtection, asyncHandler(async (req, res) => {
  const { parkId, text } = req.body
  const user = await getUserFromSession(req)

  // const validatorError = validationResult(req);

  // if(validatorError.isEmpty()) {
  const userId = user.userId
  let visited = await db.Visited.findOne({ where: { parkId, userId } })
  // let visited = await db.Visited.findAll()
  if (!visited) {
    visited = await db.Visited.create({
      userId,
      parkId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
  const visitedId = visited.toJSON().id
  await db.Review.create({
    visitedId,
    text,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  res.redirect(`/parks/${parkId}`)
  // } else {
  //   const errors = validatorError.array().map((error) => error.msg);
  //   res.json({ errors });
  // }
}))


router.get("/reviews/delete/:id(\\d+)", asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const review = await db.Review.findByPk(id, { include: db.Visited });
  const parkId = review.Visited.parkId;
  if (review.Visited.userId === req.session.auth.userId) {
    await review.destroy();
  };
  res.redirect('/parks/' + parkId);
}));


router.post("/reviews/edit/:id(\\d+)", asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const review = await db.Review.findByPk(id, { include: db.Visited });
  const parkId = review.Visited.parkId;

  const { text } = req.body;
  if (review.Visited.userId === req.session.auth.userId) {
    await review.update({
      text
    });
  };
  res.redirect(`/parks/${parkId}`);
}));

router.get("/error/:code(\\d+)", asyncHandler(async (req, res) => {
  const status = parseInt(req.params.code);
  const user = req.session.auth;
  res.status(status || 500);
  if (status === 404) {
    const randomNum = Math.floor(Math.random() * 100) % 7;
    res.render('page-not-found', { title: 'Page Not Found', user, randomNum });
  } else {
    res.render('error', { title: "Server Error", user });
  }
}));
//exporting router
module.exports = router;
