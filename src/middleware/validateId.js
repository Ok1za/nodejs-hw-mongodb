import createHttpError from "http-errors";
import { Types } from "mongoose";

export const validateId = (req, res, next) => (idName = 'id') => {
    const id = req.params[idName];

    if (!id) {
        throw new Error('Id in validateId is not provided');
    }

    if (!Types.ObjectId.isValid(id)) {
        return next(createHttpError(400, 'Invalid id'));
    }

    return next();
};
