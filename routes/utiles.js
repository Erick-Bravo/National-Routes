const csrf = require("csurf");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { Op } = require('sequelize');

const db = require("../db/models");


const asyncHandler = (handler) =>
(req, res, next) => handler(req, res, next).catch(next);

const csrfProtection = csrf( {cookie: true} );

const getUserFromSession = async req => {
    if (req.session.auth) {
        const id = parseInt(req.session.auth.userId);
        let user = await db.User.findByPk(id);
        user = user.toJSON();
        if (user)
            return {userId: user.id, username: user.username};
        else
            delete req.session.auth;
    }
    return false;
}

const checkAuth = (req, res, next) => {
    let user = getUserFromSession(req);
    if (user) next();
    else {
        const err = new Error("Page not found");
        err.status = 404;
        next(err);
    }
}

const getUserByEmailCaseInsensitive = async email => {
    let user = await db.User.findOne({
        where: {
            email: {
                [Op.iLike]: email
            }
        }
    });
    if (user) {
        user = await user.toJSON();
        return user;
    }
    return false;
}

const signUpValidator = [
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please provide valid user name")
        .isLength({ min: 3, max: 50 })
        .withMessage("Username needs to be 3 to 50 characters long")
        .custom(value => {
            //checkin if username exist case insensitive
            return db.User.findOne({ where: { username: { [Op.iLike]: value } } }).then(user => {
                if (user) {
                    return Promise.reject('Username already in use');
                }
            });
        }),
    check("email")
        .exists({ checkFalsy: true })
        .withMessage("Please provide valid email")
        .custom(value => {
            return getUserByEmailCaseInsensitive(value).then(user => {
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
        .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                console.log("value:", value, "req.body.confirmPassword:", req.body.confirmPassword)
                throw new Error('Password confirmation is incorrect');
            }
            return true;
        })
        .withMessage("Password confirmation is incorrect")
]

const loginValidators = [
    check("email")
        .exists({ checkFalsy: true })
        .withMessage("Please nter your email address")
        .custom(value => {
            return getUserByEmailCaseInsensitive(value).then(user => {
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
        .withMessage("Please Enter Your Password")
        .custom(async(value, {req}) => {
            let user = await getUserByEmailCaseInsensitive(req.body.email);
            if(user){
                const isPassword = await bcrypt.compare(value, user.password.toString());
                if (!isPassword)
                    throw new Error('Invalid password');
            }
            return true;
        }),
]

module.exports = {
    asyncHandler,
    csrfProtection,
    signUpValidator,
    loginValidators,
    validationResult,
    getUserFromSession,
    checkAuth,
    getUserByEmailCaseInsensitive
}
