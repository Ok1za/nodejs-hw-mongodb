import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required()
        .messages({
            'string.base': 'Username should be a string',
            'string.min': 'Username should have at least {#limit} characters',
            'string.max': 'Username should have at most {#limit} characters',
            'any.required': 'Username is required',
        }),
    phoneNumber: Joi.string().pattern(/^[\d\s\(\)\-]+$/).min(3).max(12).required()
        .messages({
            'string.base': 'Phone number should be a string',
            'string.min': 'Phone number should have at least {#limit} characters',
            'string.max': 'Phone number should have at most {#limit} characters',
            'any.required': 'Phone number is required',
        }),
    email: Joi.string().email({ tlds: { allow: true } }).required()
        .messages({
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),
    isFavourite: Joi.boolean()
        .messages({
            'boolean.base': 'Is Favourite should be a boolean',
        }),
    contactType: Joi.string().required().valid('work', 'home', 'personal').required()
        .messages({
            'string.base': 'Contact type should be a string',
            'any.required': 'Contact type is required',
            'any.only': 'Contact type must be one of [work, home, personal]',
        }),
});
