import { Router } from "express";
import { getContactsController, getContactByIdController, createContactController, deleteContactController, patchContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema } from "../validation/createContactSchema.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateId } from "../middleware/validateId.js";
import { updateContactSchema } from "../validation/updateContactSchema.js";
import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/upload.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);
contactsRouter.use('/:contactId', validateId('contactId'));

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));
contactsRouter.patch('/:contactId', validateId(), upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(patchContactController));
contactsRouter.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));
contactsRouter.delete('/:contactId', validateId(), ctrlWrapper(deleteContactController));

export default contactsRouter;
