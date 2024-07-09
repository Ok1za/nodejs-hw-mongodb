import { THIRTY_DAYS } from "../constants/index.js";
import { loginOrSignupWithGoogle, loginUser, logoutUser, refreshUsersSession, registerUser, resetPassword, sendResetToken } from "../services/auth.js";
import { generateAuthUrl } from "../utils/googleOAuth2.js";

export const registerUserController = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        res.status(201).json({
            status: 201,
            message: 'Successfully registered a user!',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error registering user!',
            error: error.message,
        });
    }
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken,
        },
    });
};

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
};

export const refreshUserSessionController = async (req, res) => {
    const session = await refreshUsersSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
        },
    });
};

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
    try {
        await sendResetToken(req.body.email);
        res.status(200).json({
            message: 'Reset password email was successfully sent!',
            status: 200,
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to send the email, please try again later.',
            status: 500,
            error: error.message,
        });
    }
};

export const resetPasswordController = async (req, res) => {
    await resetPassword(req.body);

    res.status(200).json({
        message: 'Password has been successfully reset.',
        status: 200,
        data: {},
    });
};

export const getGoogleOAuthUrlController = async (req, res) => {
    const url = generateAuthUrl();
    res.json({
        status: 200,
        message: 'Successfully get Google OAuth url!',
        data: {
            url,
        },
    });
};

export const loginWithGoogleController = async (req, res) => {
    const session = await loginOrSignupWithGoogle(req.body.code);
    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully logged in via Google OAuth!',
        data: {
            accessToken: session.accessToken,
        },
    });
};
