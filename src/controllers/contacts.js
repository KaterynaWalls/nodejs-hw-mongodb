import * as contactServices from '../services/contacts.js';
import createError from 'http-errors';
export const getContactsController = async (req, res, next) => {
  const contacts = await contactServices.getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const contacts = await contactServices.getContactById(id);

  if (!contacts) {
    throw createError(404, `Contact with id=$id{id}not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully found contact with id ${id}!',
    data: contacts,
  });
};
