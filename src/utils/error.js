export const throwNotFoundError = () => {
    const error = new Error('Not found');
    error.status = 404;
    throw error;
};
