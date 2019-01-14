// Load environment variables in development
if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

// Bring in express, body parser, mongoose, path and passport authenticator
const auth = require("./auth/auth.js"),
    bodyParser = require("body-parser"),
    express = require("express"),
    mongoose = require("mongoose"),
    path = require("path");

// Bring in server config
const {
    MONGODB_URL,
    REGULAR_CLEAN_INTERVAL,
    BASE_API_ROUTE,
    PORT
} = require("./config/serverConfig.js");

// Database cleaner
const databaseCleaner = require("./util/databaseCleaner.js");

// Bring in routes
const userRouter = require("./routes/users.js"),
    eventRouter = require("./routes/events.js");

// Bring in error handlers
const {
    authErrorHnalder,
    validationErrorHandler,
    userErrorHandler,
    eventErrorHandler
} = require("./util/errorHandlers.js");

// Bring in loggers
const {
    logger,
    loggerHelper,
    requestLogger,
    errorLogger
} = require("./util/loggers");

// Initiate app and use body-parser and passport auth middlewares
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(auth.initialize());

// enable cross-origin resource sharing (CORS)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "POST, GET, DELETE, PATCH, OPTIONS"
    );
    next();
});

// use logger
app.use(requestLogger);

// use routes
app.use(`${BASE_API_ROUTE}/users`, userRouter);
app.use(`${BASE_API_ROUTE}/events`, eventRouter);

// server client static build file
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// wildcard routing
app.all("*", (req, res) => {
    res.status(404).json({
        error: {
            code: 404,
            name: "ResourceNotFound",
            requestUrl: req.originalUrl,
            method: req.method,
            message:
                "The resource or url you are requesting does not exist or is not implemented in this API server, please check your url."
        }
    });
});

// use logger helper
app.use(loggerHelper);

// use error handlers and error logger
app.use(authErrorHnalder);
app.use(validationErrorHandler);
app.use(userErrorHandler);
app.use(eventErrorHandler);
app.use(errorLogger);

// Connect to MongoDB then start server
// get rid of "collection.ensureIndex" DeprecationWarning
mongoose.set("useCreateIndex", true);
// get rid of "collection.findAndModify" DeprecationWarning
mongoose.set("useFindAndModify", false);
mongoose
    .connect(
        MONGODB_URL,
        { useNewUrlParser: true }
    )
    .then(() => logger.info("DB connected!"))
    .then(() => {
        if (process.env.DATABASE_CLEANUP) {
            // regularly clean up database
            setInterval(databaseCleaner, REGULAR_CLEAN_INTERVAL);
            logger.info("Database regularly cleaning up set.");
        }
    })
    .then(() => {
        // Start server and listen on the given port
        app.listen(PORT, () => {
            logger.info(`Server starts Listening on port ${PORT}`);
        });
    })
    .catch(err => logger.error(err.toString(), { stack: err.stack }));
