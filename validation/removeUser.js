const Joi = require("joi");

module.exports = Joi.object().keys({
    email: Joi.string()
        .required()
        .email({ minDomainAtoms: 2 })
});
