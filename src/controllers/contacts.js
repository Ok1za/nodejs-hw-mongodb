import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from "../services/contacts.js";
import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
    try {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    } catch (err) {
        next(err);
    }
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return next(createHttpError(404, 'Contact not found'));
    }

    try {
        const contact = await getContactById(contactId);
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
    }
};

export const createContactController = async (req, res, next) => {
    try {
        const contact = await createContact(req.body);

        res.status(201).json({
            status: 201,
            message: 'Successfully created a contact!',
            data: contact,
        });
    } catch (err) {
        next(err);
    }
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return next(createHttpError(404, 'Contact not found'));
    }

    try {
        const result = await updateContact(contactId, req.body);
        if (!result) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.json({
            status: 200,
            message: 'Successfully patched a contact!',
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return next(createHttpError(404, 'Contact not found'));
    }

    try {
        const contact = await deleteContact(contactId);
        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
