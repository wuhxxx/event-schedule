// Define and expose all error types in this project

/**
 * A custom error type builder, returns custom error classes.
 * Each error type has a type name, a http status code and a default message
 *
 * @param {String} name              Error's name
 * @param {Number} statusCode        Error's HTTP status code
 * @param {String} defaultMessage    Error's default message
 *
 * @return {Class} An error class, which inherits the built-in Error class
 */
const ErrorType = (errorName, statusCode, defaultMessage) => {
    // The custom error class, accepts optional custom message
    class CustomError extends Error {
        constructor(message = defaultMessage) {
            super(message);
            this.name = errorName;
            this.statusCode = statusCode;
            // clip the constructor invocation from the stack trace.
            // see Nodejs's doc: https://nodejs.org/api/errors.html
            Error.captureStackTrace(this, this.constructor);
        }
    }
    // assign properties to CustomError class,
    // so that other modules can easily reference information about error types
    CustomError.errorName = errorName;
    CustomError.statusCode = statusCode;
    CustomError.defaultMessage = defaultMessage;

    return CustomError;
};

/** Usage Example **/
// const NotFound = ErrorType("NotFound", 404, "Resource not found");
// console.log(NotFound.errorName); // NotFound
// console.log(NotFound.statusCode); // 404
// console.log(NotFound.defaultMessage); // Resource not found
// const err = new NotFound("User not found");
// console.log(typeof err); // object
// console.log(err instanceof Error); // true
// console.log(err.errorName); // NotFound
// console.log(err.statusCode); // 404
// console.log(err.message); // User not found
// throw new NotFound(); // stack trace ends here

// Define and expose errors
module.exports = {
    // authentication errors
    Unauthorized: ErrorType(
        "Unauthorized",
        401,
        "No auth token. Provide your auth token by setting 'Authorization' header"
    ),
    InvalidToken: ErrorType(
        "JsonWebTokenError",
        401,
        "The provided auth token is invalid"
    ),
    TokenExpired: ErrorType(
        "TokenExpiredError",
        401,
        "The provided auth token has expired"
    ),
    // this will happen if token is valid but user has been deleted from the database
    DeletedUser: ErrorType(
        "DeletedUser",
        404,
        "The auth token is valid, but the corresponding user has been deleted from the backend database"
    ),

    // user errors
    EmailRegistered: ErrorType(
        "EmailRegistered",
        409,
        "Email address is already registered"
    ),
    UserNotFound: ErrorType("UserNotFound", 404, "User not found"),
    WrongPassword: ErrorType("WrongPassword", 400, "Incorrect password"),

    // event errors
    EventNotFound: ErrorType("EventNotFound", 404, "Event not found")
};
