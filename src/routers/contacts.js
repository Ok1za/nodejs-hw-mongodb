import { Router } from "express";
import { getContactsController, getContactByIdController, createContactController, deleteContactController, patchContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema } from "../validation/createContactSchema.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateId } from "../middleware/validateId.js";
import { updateContactSchema } from "../validation/updateContactSchema.js";

const router = Router();

router.use('/contacts/:contactId', validateId('contactId'));

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.patch('/contacts/:contactId', validateId(), validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));
router.delete('/contacts/:contactId', validateId(), ctrlWrapper(deleteContactController));

export default router;
