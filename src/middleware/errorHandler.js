import { HttpError } from 'http-errors';

export const errorHandler = async (err, req, res) => {
    if (err instanceof HttpError) {
        res.status(err.status).json({
            status: err.status,
            message: err.name,
            data: { message: err.message },
        });
        return;
    };

    res.status(500).json({
        status: 500,
        message: 'Something went wrong!',
        data: err.message,
    });
};
