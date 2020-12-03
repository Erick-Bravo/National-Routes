const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//importing local files
const db = require("../db/models");
const { environment } = require("../config");
const { asyncHandler, csrfProtection, signUpValidator,
        validationResult, loginValidators, getUserByEmailCaseInsensitive } = require("./utiles");

//Sing-Up

router.post("/sign-up", csrfProtection, signUpValidator, asyncHandler(async(req, res) => {

    const { username, email, password } = req.body;

    const validatorError = validationResult(req);

    if(validatorError.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create({
            username,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        req.session.auth = {userId: user.id, username:user.username};
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

router.get("/logout", asyncHandler( async (req, res) => {
    delete req.session.auth;
    res.redirect("/");
}))
//Login
router.post("/login", csrfProtection, loginValidators, asyncHandler (async(req, res) => {

        const { email } = req.body;

        const validatorErrors = validationResult(req);

        if(validatorErrors.isEmpty()) {
            let user = await getUserByEmailCaseInsensitive(email);
            req.session.auth = {userId: user.id, username: user.username};
            res.json({})
        } else {
            const errors = validatorErrors.array().map((error) => error.msg);
            res.json({ errors });
        }

}))



module.exports = router
