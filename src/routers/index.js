import { Router } from "express";
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const indexRouter = Router();

indexRouter.use('/contacts', contactsRouter);
indexRouter.use('/auth', authRouter);

export default indexRouter;
