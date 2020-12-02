const express = require("express");
const router = express.Router()

//importing local files
const db = require("../db/models");
const { environment } = require("../config");
const { asyncHandler, csrfProtection, signUpValidator, validationResult} = require("./utiles");

router.post("/sign-up", csrfProtection, signUpValidator, asyncHandler(async(req, res) => {

    const { username, email, password } = req.body
    const validatorError = validationResult(req)
    if(validatorError.isEmpty()) {
        await db.User.create({
            username,
            email,
            password,
            createdAt: new Date(),
            updatedAt: new Date()
         });
        res.json({}); // Authentication Token to be inserted in the future
    } else {
        const errors = validatorError.array().map((error) => error.msg);
        res.json({ errors });
    }
}))

router.get("/demo", asyncHandler( async (req, res) => {
    const user = await db.User.findOne({
        where: {
            username: "DemoUser",
            email: "DemoUser@NatlRoutes.com"
        }
    });
    console.log(user);
    if (!user) {
        res.send("Please seed all files");
    } else {
        req.session.auth = {userId: user.id, username: user.username};
        res.redirect('/my-routes');
    }
}))



module.exports = router
