// Bring in strategy(s) and config
const jwtStrategy = require("./jwtStrategy.js"),
    { JWT_AUTH_OPTIONS } = require("../config/serverConfig.js");

// Bring in passport
const passport = require("passport");

// Bring in auth related errors
const {
    Unauthorized,
    InvalidToken,
    TokenExpired,
    DeletedUser
} = require("../util/errorTypes.js");

// Use strategy(s)
passport.use(jwtStrategy);

// Expose initialize and authentication(s) as closures
module.exports = {
    // passport.initialize
    initialize: () => {
        return passport.initialize();
    },

    // jwt authenticate
    jwtAuth: () => {
        // use custom callback of passport.js,
        // so that auth error can be caught and handled by server's error handler
        // as well as sending custom auth error response.
        // see: http://www.passportjs.org/docs/authenticate/
        return (req, res, next) => {
            passport.authenticate(
                "jwt",
                JWT_AUTH_OPTIONS,
                (err, user, info) => {
                    // error has been logged in jwtStrategy, no need to log again
                    if (err) next(err);

                    // console.log("info.name = ", info.name);
                    if (!user) {
                        if (info) {
                            // token has something wrong
                            console.log(info);
                            if (info.name === InvalidToken.errorName)
                                next(new InvalidToken());
                            else if (info.name === TokenExpired.errorName)
                                next(new TokenExpired());
                            else next(new Unauthorized());
                        } else {
                            // token is ok, but user can't be found in database
                            next(new DeletedUser());
                        }
                    } else {
                        // user will be attached to req
                        // access by req.user
                        req.user = user;
                        next();
                    }
                }
            )(req, res, next);
        };
    }
};
