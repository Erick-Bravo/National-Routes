const express = require("express");
const router = express.Router()
const bcrypt = require("bcryptjs")

//importing local files
const db = require("../db/models");
const { environment } = require("../config");
const { asyncHandler, csrfProtection, signUpValidator, validationResult, loginValidators } = require("./utiles");

//Sing-Up

router.post("/sign-up", csrfProtection, signUpValidator, asyncHandler(async(req, res) => {

    const { username, email, password } = req.body

    const validatorError = validationResult(req)
    if(validatorError.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.User.create({
            username,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        });


        res.json({}); // Authentication Token to be inserted in the future


    } else {
        const errors = validatorError.array().map((error) => error.msg);
        res.json({ errors });
    }
}))



router.get("/routes", (req, res) => {
    res.send("Welcome !#$%^&");
})

//Login

router.post("/login",
    csrfProtection,
    loginValidators,
    asyncHandler (async(req, res) => {

        const { email, password, } = req.body
        let errors = []
        const validatorErrors = validationResult(req)

        res.json({})

        if(validatorErrors.isEmpty()) {

        } else {
            errors = validatorErrors.array().map((error) => error.msg)
            res.json({ errors });
        }
        res.render("user-login", { title: "Login", email, errors, token: req.csrfToken() })
}))



module.exports = router
