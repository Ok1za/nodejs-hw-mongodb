import { Contact } from "../db/contact.js";

export const getAllContacts = async () => {
    const contacts = await Contact.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const contact = await Contact.create(payload);
    return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
    const contact = await Contact.findOneAndUpdate(
        { _id: contactId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );

    if (!contact || !contact.value) return null;

    return contact.value;
};

export const deleteContact = async (contactId) => {
    const contact = await Contact.findByIdAndDelete({
        _id: contactId,
    });

    return contact;
};
