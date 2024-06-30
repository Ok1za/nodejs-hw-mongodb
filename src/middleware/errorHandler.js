import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        res.status(err.status).json({
            status: err.status,
            message: 'Operation failed',
            data: { message: err.message },
        });
        return;
    }
    next(err);

    res.status(500).json({
        status: 500,
        message: 'Something went wrong!',
        data: { message: err.message },
    });
};
