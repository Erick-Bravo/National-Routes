const express = require("express");
const { asyncHandler, csrfProtection, signUpValidator, validationResult} = require("./utiles")
const router = express.Router()

//importing local files
const db = require("../db/models");
const { environment } = require("../config");



router.post("/sign-up", (req, res, next) => {
    console.log(req.body.username, req.cookies)
    next()
}, csrfProtection, signUpValidator, asyncHandler(async(req, res) => {

    console.log("merp")
    const { username, email, password } = req.body
    const validatorError = validationResult(req)
    if(validatorError.isEmpty()) {
        await db.User.create({
            username,
            email,
            password,
            createdAt: new Date(),
            updatedAt: new Date()
         })
        res.redirect("/routes")
    } else {
    const errors = validatorError.array().map((error) => error.msg);
    res.json({ errors })
    }


}))



module.exports = router
