import createHttpError from "http-errors";
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { UsersCollection } from "../db/models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SessionsCollection } from "../db/models/session.js";
import { randomBytes } from "crypto";
import { FIFTEEN_MINUTES, TEMPLATES_DIR, THIRTY_DAYS } from "../constants/index.js";
import { env } from '../utils/env.js';
import { sendEmail } from "../utils/sendMail.js";
import { SMTP } from "../constants/constants.js";

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    };
};

export const registerUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });

    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async ({ email, password }) => {
    const user = await UsersCollection.findOne({ email });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await SessionsCollection.deleteOne({ userId: user._id });

    return await SessionsCollection.create({
        userId: user._id,
        ...createSession(),
    });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionsCollection.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    if (new Date() > new Date(session.refreshTokenValidUntil)) {
        throw createHttpError(401, 'Session refreshToken expired');
    }

    const newSession = createSession();

    await SessionsCollection.deleteOne({ _id: sessionId });

    return await SessionsCollection.create({
        userId: session.userId,
        ...newSession,
    });
};

export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};

export const sendResetToken = async (email) => {
    const user = await UsersCollection.findOne({ email });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        env('SMTP.JWT_SECRET'),
        {
            expiresIn: '15m',
        },
    );

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password.html',
    );

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)).toString();

    const template = handlebars.compile(templateSource);

    const html = template({
        name: user.name,
        link: `${env('SMTP.APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
        from: env(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });
};

export const resetPassword = async ({ token, password }) => {
    let entries;

    try {
        entries = jwt.verify(token, env('SMTP.JWT_SECRET'));
    } catch (err) {
        if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
        throw err;
    }

    const user = await UsersCollection.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await UsersCollection.findOneAndUpdate(
        { _id: user._id },
        { password: encryptedPassword },
    );
};
