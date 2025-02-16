import ContactCollection from '../db/models/Contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';
import createHttpError from 'http-errors';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc', 
  filter = {},
}) => {
  const limit = perPage;
  const skip =(page - 1) * perPage;
  const contactQuery =  ContactCollection.find();

  if (typeof filter.isFavourite === 'boolean') {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if(filter.userId) {
    contactQuery.where('userId').equals(filter.userId);
  }

  const [totalItems, data] = await Promise.all([
    ContactCollection.find().merge(contactQuery).countDocuments(),
    contactQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calcPaginationData({ totalItems, page, perPage });

  if (page > paginationData.totalPages || page < 1) {
    throw createHttpError(400, `Invalid page number`, {
      requestedPage: page,
      totalPages: paginationData.totalPages,
    });
  }

  return {
    data,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
    const contact = await ContactCollection.findById(contactId);
    return contact;
};

export const getContact = filter => ContactCollection.findOne(filter);

export const createContact = payload => ContactCollection.create(payload);

export const updateContact = async (filter, payload, options = {}) => {


    const result = await ContactCollection.findOneAndUpdate(
filter, payload,
      {
        new: true,
        ...options,
      },
    );

    if (!result) {
        
        return null;
    }

    return result;
  };



export const deleteContact = filter => ContactCollection.findOneAndDelete(filter);
