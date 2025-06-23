const Joi = require('joi');

const postSchema = Joi.object({
    text: Joi.string().min(3).required(),
    imageUrl: Joi.string().uri().optional()
});

module.exports = postSchema;