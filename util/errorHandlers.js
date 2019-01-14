// Handle all types of error,
// including joi validation error, mongodb cast error,
// errors in errorTypes.js and other server errors.

// Load util
const errorRes = require("./responseBuilder.js").errorResponse,
    {
        Unauthorized,
        InvalidToken,
        TokenExpired,
        DeletedUser,
        EmailRegistered,
        UserNotFound,
        WrongPassword,
        EventNotFound
    } = require("./errorTypes.js");

/**
 * Authentication error handler middleware
 *  Handle auth error thrown from passport.js
 */
const authErrorHnalder = (err, req, res, next) => {
    const statusCode = err.statusCode;
    switch (err.name) {
        case Unauthorized.errorName:
            return res
                .status(statusCode)
                .json(errorRes(statusCode, err.name, err.message));
        case InvalidToken.errorName:
            return res
                .status(statusCode)
                .json(errorRes(statusCode, err.name, err.message));
        case TokenExpired.errorName:
            return res
                .status(statusCode)
                .json(errorRes(statusCode, err.name, err.message));
        case DeletedUser.errorName:
            return res
                .status(statusCode)
                .json(errorRes(statusCode, err.name, err.message));
        default:
            next(err);
    }
};

/**
 * Validation error handler middleware
 *   Handle joi validation error
 */
const validationErrorHandler = (err, req, res, next) => {
    if (err.isJoi) {
        const { message } = err.details[0];
        return res.status(400).json(errorRes(400, err.name, message));
    } else {
        next(err);
    }
};

/**
 * User error handler middleware
 *   Handle all user errors in errorTypes.js,
 *   use switch...case statement for better management of handled error types
 */
const userErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode;
    // switch statement uses strict comparison '==='
    switch (err.name) {
        case EmailRegistered.errorName:
            return res
                .status(statusCode)
                .json(errorRes(statusCode, err.name, err.message));

        case UserNotFound.errorName:
            return res
                .status(statusCode)
                .json(errorRes(statusCode, err.name, err.message));

        case WrongPassword.errorName:
            return res
                .status(statusCode)
                .json(errorRes(statusCode, err.name, err.message));

        default:
            next(err);
    }
};

/**
 * Event error handler middleware
 *   Handle all event errors in errorTypes.js,
 *   use switch...case statement for better management of handled error types
 */
const eventErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode;
    // switch statement uses strict comparison '==='
    switch (err.name) {
        case EventNotFound.errorName:
            return res
                .status(statusCode)
                .json(errorRes(statusCode, err.name, err.message));

        default:
            next(err);
    }
};

/**
 * Server error handler middleware
 *   Handle all errors other than above errors
 *   these errors can be unexpected, right now, just return internal sever error
 *   ! when internal server error occurs, this middleware will not be reached,
 *   ! express handles server error itself.
 */
// const serverErrorHandler = (err, req, res) => {
//     return res.status(500).json(errorRes(500, err.name, err.message));
// };

module.exports = {
    authErrorHnalder,
    validationErrorHandler,
    userErrorHandler,
    eventErrorHandler
    // serverErrorHandler
};
