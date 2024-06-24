import Joi from "joi";

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().pattern(/^[\d\s\(\)\-]+$/).min(3).max(12),
    email: Joi.string().email({ tlds: { allow: true } }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().required().valid('work', 'home', 'personal'),
});
