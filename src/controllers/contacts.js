import { getAllContacts, getContactById, updateContact, deleteContact, createContact } from "../services/contacts.js";
import createHttpError from 'http-errors';
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getContactsController = async (req, res, next) => {
    try {
        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query);
        const filter = parseFilterParams(req.query);

        const contacts = await getAllContacts({
            page,
            perPage,
            sortBy,
            sortOrder,
            filter,
            userId: req.user._id,
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

export const createContactController = async (req, res) => {
    try {
        const photo = req.file;

        let photoUrl;

        if (photo) {
            photoUrl = await saveFileToCloudinary(photo);
        }

        const newContact = await createContact({
            ...req.body,
            userId: req.user._id,
            photo: photoUrl,
        });

        res.status(201).json({
            status: res.statusCode,
            message: 'Successfully created a contact!',
            data: newContact,
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
    const userId = req.user._id;
    const photo = req.file;

    try {
        let photoUrl;

        if (photo) {
            photoUrl = await saveFileToCloudinary(photo);
        }

        const updateData = {
            ...req.body,
            userId,
        };

        if (photoUrl) {
            updateData.photo = photoUrl;
        }

        const updatedContact = await updateContact(contactId, updateData);

        if (!updatedContact) {
            next(createHttpError(404, 'Contact not found'));
            return;
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully patched a contact!',
            data: updatedContact,
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
