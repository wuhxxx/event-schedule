import {
    USERNAME,
    EMAIL,
    PASSWORD,
    USERNAME_ERROR,
    EMAIL_ERROR,
    PASSWORD_ERROR
} from "../constants";

// functions to validate various form inputs

/**
 * validate if it is email
 * @param {String} email
 * @returns {Object} Object with specific key, if input is truthy and invalid, value is truthy, otherwise value is an empty string, which is falsy.
 */
export const validateEmail = email => {
    // see: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return {
        [EMAIL_ERROR]: !email || reg.test(email) ? "" : "Invalid email address"
    };
};

/**
 * validate if username matches requirement
 * @param {String} username
 * @returns {Object} Object with specific key, if input is truthy and invalid, value is truthy, otherwise value is an empty string, which is falsy.
 */
export const validateUsername = username => {
    // User name must be 2-12 long,
    // no leading/ending space or "."

    // const reg = /^(?=.{2,12}$)(?![.\s])[a-zA-Z0-9._\s]+(?<![.\s])$/;
    // fix "SyntaxError: Invalid regular expression: invalid group specifier name" on safari
    const reg = /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){0,10}[a-zA-Z0-9]$/;
    return {
        [USERNAME_ERROR]:
            !username || reg.test(username)
                ? ""
                : "2~12 long alphabets and numbers, no leading/ending space or ."
    };
};

/**
 * validate if password matches requirement
 * @param {String} password
 * @returns {Object} Object with specific key, if input is truthy and invalid, value is truthy, otherwise value is an empty string, which is falsy.
 */
export const validatePassword = password => {
    // password must be 4-30 long, accepts digits, lower/upper case and !@#$%^&
    const reg = /^[a-zA-Z0-9!@#$%^&]{4,30}$/;
    return {
        [PASSWORD_ERROR]:
            !password || reg.test(password)
                ? ""
                : "4~30 long alphabets, numbers and symbols of !@#$%^&"
    };
};

// group up user form input validators ,return different validator according to target name
export const userFormInputValidators = {
    [EMAIL]: validateEmail,
    [USERNAME]: validateUsername,
    [PASSWORD]: validatePassword
};
