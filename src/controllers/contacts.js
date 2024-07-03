import { getAllContacts, getContactById, updateContact, deleteContact } from "../services/contacts.js";
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { UsersCollection } from '../db/models/user.js';
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getContactsController = async (req, res, next) => {
    try {
        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query);
        const filter = parseFilterParams(req.query);
        filter.userId = req.user._id;

        const contacts = await getAllContacts({
            page,
            perPage,
            sortBy,
            sortOrder,
            filter,
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    } catch (err) {
        next(err);
        return;
    }
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return next(createHttpError(404, 'Contact not found'));
    }

    try {
        const contact = await getContactById(contactId, req.user._id);
        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (err) {
        next(err);
        return;
    }
};

export const createContactController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const photo = req.file;
        let photoUrl;

        if (photo) {
            photoUrl = await saveFileToCloudinary(photo);
        }

        const contact = await UsersCollection.create({ ...req.body, userId, photo: photoUrl });

        res.status(201).json({
            status: 201,
            message: 'Successfully created a contact!',
            data: contact,
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: 'Error creating contact',
            error: err.message,
        });
    }
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const photo = req.file;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return next(createHttpError(404, 'Contact not found'));
    }

    try {
        let photoUrl;

        if (photo) {
            photoUrl = await saveFileToCloudinary(photo);
        }

        const updateData = { ...req.body };

        if (photoUrl) updateData.photo = photoUrl;

        const result = await updateContact(contactId, updateData, req.user._id);

        if (!result) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.status(200).json({
            status: 200,
            message: 'Successfully patched a contact!',
            data: result,
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: 'Error updating contact',
            error: err.message,
        });
    }
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return next(createHttpError(404, 'Contact not found'));
    }

    try {
        const contact = await deleteContact(contactId, req.user._id);
        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.status(204).send();
    } catch (err) {
        next(err);
        return;
    }
};
