const Joi = require("joi");

module.exports = Joi.object().keys({
    data: Joi.object()
        .keys({
            title: Joi.string(),
            location: Joi.string().allow(""),
            description: Joi.string().allow(""),
            color: Joi.number()
                .min(0)
                .max(16777215), // decimal value of hex 0xFFFFFF
            startAt: Joi.number()
                .min(0)
                .max(1440),
            endAt: Joi.number()
                .min(0)
                .max(1440)
                .greater(Joi.ref("startAt")),
            weekday: Joi.number()
                .min(0)
                .max(4)
        })
        .required()
});
