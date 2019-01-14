// Expose server config
module.exports = {
    // mongoDB URL
    MONGODB_URL:
        process.env.MONGODBURL ||
        "mongodb://localhost:27017/event-schedule-server",

    // regular database clean up interval
    REGULAR_CLEAN_INTERVAL: 1000 * 60 * 60 * 24 * 7,

    // our server's base api route, including version
    BASE_API_ROUTE: "/api/v1",

    // JWT secretOrKey
    JWT_SECRET_OR_KEY: process.env.JWTSECRETORKEY || "secret",

    // Options for passport-jwt authentication
    JWT_AUTH_OPTIONS: {
        // more options : http://www.passportjs.org/docs/authenticate/
        session: false
    },

    // port to listen on
    PORT: 8000,

    // token expires after 3 days
    // unit is SECOND, when value is number
    // unit is MILESECOND when value is string without unit such as "120"
    TOKEN_EXPIRES_IN: 60 * 60 * 24 * 3
};
