// remove all documents in both collections

// Load User and Event model
const User = require("../models/User.js"),
    Event = require("../models/Event.js");

// logger
const { logger } = require("./loggers.js");

module.exports = async () => {
    try {
        logger.info("Cleaning database...");
        await User.deleteMany({});
        await Event.deleteMany({});
        logger.info("Database cleaning done!");
    } catch (err) {
        logger.error(
            `Caught error while cleaning up database: ${err.toString()}`,
            {
                stack: err.stack
            }
        );
    }
};
