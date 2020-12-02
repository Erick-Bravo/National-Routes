const express = require("express");
const router = express.Router()
const bcrypt = require("bcryptjs")

//importing local files
const db = require("../db/models");
const { environment } = require("../config");
const { asyncHandler, csrfProtection, signUpValidator, validationResult} = require("./utiles");




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



module.exports = router
