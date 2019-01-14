const Joi = require("joi");

module.exports = Joi.object().keys({
    eventIds: Joi.array()
        .min(1)
        .required()
        .items(
            Joi.string()
                .length(24)
                .required()
        )
});
