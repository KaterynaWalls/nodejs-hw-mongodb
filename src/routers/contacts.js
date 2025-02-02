import { Router } from 'express';
import * as contactsController from '../controllers/contacts.js';

const contactsRouter = Router();
contactsRouter.get('/', contactsController.getContactsController);

contactsRouter.get('/:id', contactsController.getContactByIdController);

export default contactsRouter;
