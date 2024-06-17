import createHttpError from "http-errors";
import { Types } from "mongoose";

export const validateId = (idName = 'contactId') => (req, res, next) => {
    const id = req.params[idName];

    if (!id) {
        return next(createHttpError(400, 'Id is not provided'));
    }

    if (!Types.ObjectId.isValid(id)) {
        return next(createHttpError(400, 'Invalid id'));
    }

    return next();
};
