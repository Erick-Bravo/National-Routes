
# National Routes

## Table of Contents

1. [Introduction](#introduction)
2.  [Dependencies](#dependencies)
3.  [Features](#features)
	- [Register](#register)
	- [Login](#login)
	- [Parks](#parks)
	- [Search](#search)
	- [User Experience](#user-experience)
		- [Create List](#create-list)
		- [Add Park](#add-park)
		- [Remove Park](#remove-park)
		- [Rate Park](#rate-park)
		- [Review Park](#review-park)
		- [View](#view)
			- [View Routes](#view-routes)
			- [View Visited](#view-visited)

## Introduction

National Routes is a clone of [GoodReads](http://goodreads.com) to support hikers and travelers love for nature in the United States. It will allow users to see what National Park is in their neck of the woods and create their own routes for future visits. Once they're done, they can rate and review that experience for others to see.

## Dependencies

- Heroku
- Express Server
- Sequelize
- AJAX

## Features

 - ### Register
	 The section will be available on the site's homepage.

- ### Login
	A function integrated into our homepage that will allow the user to login and not disrupt their current viewing experience.

	![](./assets/Login-SignUp10.gif)

- ### Parks
	Visitors to the site will be able to view images and details about the National Park they are interested in. The details will include: details about the park, location, average rate, reviews, and an option to add the park to a custom route as a logged in user.

	The way our reviews are displayed is through a pug conditional.

	```pug
		if (!reviews.length)
			h4.comments Sorry, no one has made a review.
		else
			each review in reviews
				h4(id="review" + review.id, class="comments") #{review.user.username} said :
					p #{review.text}

- ### Search
	Visitors will be able to use the search bar to find a National Park. If there is only one result, they will be redirected to the specific park. If they user searched by state, they will be given a list of parks in that state.
	![](./assets/Search.gif)

- ### User Experience
	A registered user will be able to gain more functionality to the site.

	The user can create their own list of places to visit with an add and remove function, rate the park they have visited and write their own review!
	- ### Create List
		The user will have their own "Profile" page where they can create their own routes(places they want to visit) and have a custom name to it.
		![](./assets/AddRoute.gif)

	- ### Add Park
		The user will be able to view the park's page and add it into their routes.

	- ### Remove Park
		The user can access their custom routes and delete the park they don't want on there anymore.

	- ### Rate Park
		User will be able to click on the park page and add their own rating out of 5 stars.
![](./assets/RatePark.gif)

		```javascript
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

		if (req.query.visited === true){
			res.redirect("/my-routes");
		} else {
			res.redirect(`/parks/${parkId}`);
		}

		```
	- ### Review Park
		User will be able to review the park they have visited.
		![](./assets/AddReview.gif)

	- ### View
		Provide the user the ability to view their custom routes and places 	they have visited
		- ### View Routes
			User will have access to see all the custom routes they have created as a nav bar on their own "Profile" page.
			![](./assets/Routes.gif)
		- ### View Visited
			There will be a link for the user to access all the locations they have visited.
