const express = require("express");
const { asyncHandler, csrfProtection, signUpValidator, validationResult} = require("./utiles")
const router = express.Router()

//importing local files
const db = require("../db/models");
const { environment } = require("../config");



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
         })
        res.redirect("/routes")
    } else {
    const errors = validatorError.array().map((error) => error.msg);
    res.render("park-list", { errors, token: req.csrfToken() })
    res.end()
    }


}))



module.exports = router
