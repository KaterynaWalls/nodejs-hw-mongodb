import * as contactServices from '../services/contacts.js';
import createError from 'http-errors';
import mongoose from 'mongoose';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { SORT_BY } from '../constants/contactTypeList.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import {parseFilterParams} from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, SORT_BY);
  const  filter = parseFilterParams(req.query);
  console.log("📌 filter перед додаванням userId:", filter);

  filter.userId = req.user._id;
  

  const contacts = await contactServices.getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });


  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const {_id: userId} = req.user;
  const { id: _id } = req.params;

  const contact = await contactServices.getContact({_id, userId});

  if (!contact) {
    throw createError(404, `Contact with id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}!`,
    data: contact,
  });
};

export const createContactController = async(req, res) => {
  const {_id: userId} = req.user;
const contact = await contactServices.createContact({...req.body, userId});
res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const upsertContactController = async(req, res) => {
    const { id: contactId } = req.params;
    const {_id: userId} = req.user;
    const {isNew, data} = await contactServices.upsertContact({_id: contactId}, { ...req.body, userId}, {upsert: true});
const status = isNew ? 201 : 200;
res.status(status).json ({
    status,
    message: `Successfully updated a contact!`,
    data,
  });
};

export const patchContactController = async (req, res) => {
    const { id } = req.params;
    const {_id: userId} = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, 'Invalid contact ID format');
    }
    const result = await contactServices.updateContact({_id: id, userId}, req.body, {new: true});
    
    if (!result) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result,
    });
  };

  export const deleteContactController = async(req, res)=> {
    const {id} = req.params;
    const {_id: userId} = req.user;
    const data = await contactServices.deleteContact({_id: id, userId});

    if(!data) {
        throw createError(404, `Contact with id=${id} not found`);
    }

    res.status(204).send();
};  