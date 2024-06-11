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
    const contact = await Contact.findByIdAndUpdate(contactId, payload, {
        new: true,
        ...options,
    });

    return contact;
};

export const deleteContact = async (contactId) => {
    const contact = await Contact.findByIdAndDelete(contactId);

    return contact;
};
