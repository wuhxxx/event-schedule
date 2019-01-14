// User model and server config
const User = require("../models/User.js"),
    { JWT_SECRET_OR_KEY } = require("../config/serverConfig.js"),
    JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

// JwtStrategy options
const options = {
    // extract jwt token with bearer scheme
    // means token will be sent in request header in a field called "Authorization",
    // i.e.: Authorization: "Bearer yJhbGciOiJIUzNisInIkpXVCJ9.eyJzdWIiiIxMj0NT"
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

    // secret or key
    secretOrKey: JWT_SECRET_OR_KEY
};

// Expoese the jwt strategy
module.exports = new JwtStrategy(options, (jwtPayload, done) => {
    // fix: findOne -> findById
    User.findById(jwtPayload.id)
        .populate("events", "-createDate")
        .then(user => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => {
            return done(err, false);
        });
});
