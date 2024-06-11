export const notFoundHandler = async (req, res) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
        data: { message: 'Route not found' },
    });
};
