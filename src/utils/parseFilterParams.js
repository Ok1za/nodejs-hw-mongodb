export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;

    const filter = {};

    if (type) {
        filter.contactType = type;
    }

    if (typeof isFavourite !== 'undefined') {
        filter.isFavourite = isFavourite === 'true';
    }

    return filter;
};
