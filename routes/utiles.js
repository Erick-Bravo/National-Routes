const csrf = require("csurf");
const { check, validationResult } = require("express-validator")
const { User } = require("../db/models")


const asyncHandler = (handler) =>
(req, res, next) => handler(req, res, next).catch(next);

const csrfProtection = csrf( {cookie: true} );


const signUpValidator = [
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please provide valid user name")
        .isLength({ min: 3, max: 50 })
        .withMessage("Username needs to be 3 to 50 characters long")
        .custom(value => {
            return User.findOne({ where: { username: value } }).then(user => {
                if (user) {
                    return Promise.reject('Username already in use');
                }
            });
        }),
    check("email")
        .exists({ checkFalsy: true })
        .withMessage("Please provide valid email")
        .custom(value => {
            return User.findOne({ where: { email: value } }).then(user => {
                if (user) {
                    return Promise.reject('E-mail already in use');
                }
            });
        })
        .withMessage("Email already in use")
        .isEmail()
        .withMessage("Please enter a valid Email"),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a valid password")
        .isLength({ min: 6})
        .withMessage("Password needs to be longer than 6 characters")
        // .custom((value, { req }) => {
        //     if (value !== req.body.confirmPassword) {
        //       throw new Error('Password confirmation is incorrect');
        //     }
        // })
        // .withMessage("Password confirmation is incorrect")
]

const loginValidators = [
    check("email")
        .exists({ checkFalsy: true })
        .withMessage("Please nter your email address")
        .custom(value => {
            return User.findOne({ where: { email: value } }).then(user => {
                if(!user) {
                    return Promise.reject("The email entered does not exist")
                }
            })
        })
        .withMessage("Email does not exist")
        .isEmail()
        .withMessage("Please enter a valid email"),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please Enter Your Password"),
]



module.exports = {
    asyncHandler,
    csrfProtection,
    signUpValidator,
    validationResult,
    loginValidators
}
