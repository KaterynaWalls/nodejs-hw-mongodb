import * as contactServices from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  const contacts = await contactServices.getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const contacts = await contactServices.getContactById(id);
  if (!contacts) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id ${id} not found`,
    });
  }

  res.json({
    status: 200,
    message: 'Successfully found contact with id {contactId}!',
    data: contacts,
  });
};
