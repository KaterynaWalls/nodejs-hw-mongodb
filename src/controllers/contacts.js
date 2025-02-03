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
    throw createError(404, `Contact with id=${id}not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contacts,
  });
};

export const createContactController = async(req, res) => {
const contact = await contactServices.createContact(req.body);
res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const upsertContactController = async(req, res) => {
    const { contactId } = req.params;
    const {isNew, data} = await contactServices.upsertContact(contactId, req.body, {upsert: true,});
const status = isNew ? 201 : 200;
res.status(status).json ({
    status,
    message: `Successfully updated a contact!`,
    data,
  });
};

    export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const result = await contactServices.updateContact(contactId, req.body);
  
    if (!result) {
     throw createError(404, 'Contact  not found');
     
    }
  
    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: result.contact,
    });
  };

  export const deleteContactController = async(req, res)=> {
    const {id} = req.params;
    const data = await contactServices.deleteContact({_id: id});

    if(!data) {
        throw createError(404, `Contact with id=${id} not found`);
    }

    res.status(204).send();
};