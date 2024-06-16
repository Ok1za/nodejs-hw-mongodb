import { Contact } from "../db/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/constants.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortBy = '_id',
    sortOrder = SORT_ORDER.ASC,
    }) => {
    try {
        const limit = perPage;
        const skip = (page - 1) * perPage;

        const contactsCount = await Contact.countDocuments();
        const contacts = await Contact.find()
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .exec();

        const paginationData = calculatePaginationData(contactsCount, perPage, page);

        return {
            data: contacts,
            ...paginationData,
        };
    } catch (error) {
        console.error("Error in getAllContacts:", error);
        throw new Error("Failed to get contacts");
    }
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
