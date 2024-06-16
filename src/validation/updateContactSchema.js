import Joi from "joi";

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.number().min(3).max(12),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().required().valid('work', 'home', 'personal'),
});
