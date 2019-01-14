const Joi = require("joi");

module.exports = Joi.object().keys({
    title: Joi.string().required(),
    location: Joi.string().allow(""),
    description: Joi.string().allow(""),
    color: Joi.number()
        .min(0)
        .max(16777215) // decimal value of hex 0xFFFFFF
        .required(),
    startAt: Joi.number()
        .min(0)
        .max(1440)
        .required(),
    endAt: Joi.number()
        .min(0)
        .max(1440)
        .greater(Joi.ref("startAt"))
        .required(),
    weekday: Joi.number()
        .min(0)
        .max(4)
        .required()
});
