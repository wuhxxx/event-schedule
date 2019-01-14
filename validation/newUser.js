const Joi = require("joi");

// "username", "email" and "password" are required for registration
module.exports = Joi.object().keys({
    username: Joi.string()
        .required()
        .regex(/^(?=.{2,12}$)(?![.\s])[a-zA-Z0-9._\s]+(?<![.\s])$/),
    email: Joi.string()
        .required()
        .email({ minDomainAtoms: 2 }),
    password: Joi.string()
        .required()
        .regex(/^[a-zA-Z0-9!@#$%^&]{4,30}$/)
});
