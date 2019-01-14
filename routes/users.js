// Load dependencies
const express = require("express"),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    succeed = require("../util/responseBuilder.js").successResponse,
    {
        JWT_SECRET_OR_KEY,
        TOKEN_EXPIRES_IN
    } = require("../config/serverConfig.js");

// Load User and Event model
const User = require("../models/User.js"),
    Event = require("../models/Event.js");

// Load joi validator and validation schema
const Joi = require("joi"),
    newUserSchema = require("../validation/newUser.js"),
    loginSchema = require("../validation/login.js"),
    removeUserSchema = require("../validation/removeUser.js");

// Load error type
const {
    EmailRegistered,
    UserNotFound,
    WrongPassword
} = require("../util/errorTypes.js");

// express router
const router = express.Router();

/**
 * Register new user.
 * Required fileds in req.body:
 *   - username (String), client side browser displays this in top bar
 *   - email (String), user indentifier, unique
 *   - password (String), 4-30 length, ^[a-zA-Z0-9!@#$%^&]{4,30}$
 *
 * @method     POST
 * @endpoint   /signup
 * @access     Public
 * @returns    Jwt token(response.data.token), username(response.data.username) and token expire time(response.data.expiresIn)
 */
router.post("/signup", async (req, res, next) => {
    try {
        // validate input
        await Joi.validate(req.body, newUserSchema);

        // check if email exists in database
        const userArray = await User.find({
            email: req.body.email
        }).limit(1);
        // find().limit(1) returns an empty array if email not registered,
        // or an array contains only one element if email registered,
        // if user with this email exists, throw error
        if (userArray.length > 0) throw new EmailRegistered();

        // new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email
        });

        // set hashed password
        newUser.password = await bcrypt.hash(req.body.password, 10);

        // save to database
        const savedUser = await newUser.save();

        // token expires in
        const expiresIn = TOKEN_EXPIRES_IN;

        // assign jwt token, payload includes user's id,
        // must use '.id' to access generated user id
        const jwt_payload = { id: savedUser.id };
        const token = await jwt.sign(jwt_payload, JWT_SECRET_OR_KEY, {
            expiresIn
        });

        // send jwt token, username and expiresIn back
        const username = savedUser.username;
        return res.status(200).json(succeed({ token, username, expiresIn }));
    } catch (error) {
        next(error);
    }
});

/**
 * User log in.
 * Required fields in req.body
 *   - emial (String)
 *   - password (String)
 *
 * @method     POST
 * @endpoint   /login
 * @access     Public
 * @returns    Jwt token(response.data.token), username(response.data.username) and token expire time(response.data.expiresIn)
 */
router.post("/login", async (req, res, next) => {
    try {
        // validation
        await Joi.validate(req.body, loginSchema);

        // check if email already exists in database
        const userArray = await User.find({ email: req.body.email }).limit(1);
        // find().limit(1) returns an empty array if user not exists,
        // or an array contains only one element if user exists,
        // if array is empty, throw error
        if (userArray.length === 0) throw new UserNotFound();

        // get pointer to corresponding user document
        const user = userArray[0];

        // compare password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        // if password not match, throw error
        if (!isMatch) throw new WrongPassword();

        // token expires in
        const expiresIn = TOKEN_EXPIRES_IN;

        // assign jwt token, payload includes user's id,
        // must use '.id' to access generated user id
        const jwt_payload = { id: user.id };
        const token = await jwt.sign(jwt_payload, JWT_SECRET_OR_KEY, {
            expiresIn
        });

        // send jwt token, username and expiresIn back
        const username = user.username;
        return res.status(200).json(succeed({ token, username, expiresIn }));
    } catch (error) {
        next(error);
    }
});

/**
 * Delete user and user's events in database
 *
 * @method     DELETE
 * @endpoint   /
 * @access     Public
 * @returns    the deleted user id and user's events id
 */
router.delete("/", async (req, res, next) => {
    try {
        // validation
        await Joi.validate(req.body, removeUserSchema);

        // find user and user's events
        const userArray = await User.find({ email: req.body.email }).limit(1);
        if (userArray.length === 0) throw new UserNotFound();
        const userToDelete = userArray[0];
        const eventsToDelete = userToDelete.events;

        // delete in database
        await Event.deleteMany({ _id: { $in: eventsToDelete } });
        await User.deleteOne({ _id: userToDelete._id });

        // response
        return res.status(200).json(
            succeed({
                deletedUser: userToDelete.email,
                deletedEventsId: eventsToDelete
            })
        );
    } catch (error) {
        next(error);
    }
});

// Expose routes
module.exports = router;
