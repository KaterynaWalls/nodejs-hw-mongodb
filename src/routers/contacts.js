import { Router } from 'express';
import * as contactsController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {validateBody} from '../middlewares/validateBody.js';
import {createContactSchema, updateContactSchema } from '../validation/contacts.js';
import {isValidId} from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = Router();
contactsRouter.use(authenticate);

contactsRouter.get('/',  ctrlWrapper(contactsController.getContactsController));
contactsRouter.get('/:id', isValidId, ctrlWrapper(contactsController.getContactByIdController));
contactsRouter.post('/', validateBody(createContactSchema), ctrlWrapper(contactsController.createContactController));
contactsRouter.patch('/:id', isValidId, validateBody(updateContactSchema),  ctrlWrapper(contactsController.patchContactController));
contactsRouter.delete('/:id', isValidId, ctrlWrapper(contactsController.deleteContactController));


export default contactsRouter;
