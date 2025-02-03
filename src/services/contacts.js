import ContactCollection from '../db/models/Contact.js';

export const getAllContacts = async () => {
    const contacts = await ContactCollection.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await ContactCollection.findById(contactId);
    return contact;
};

export const createContact = payload => ContactCollection.create(payload);

export const updateContact = async (contactId, payload, options = {}) => {
   const {upsert = false} = options;
   const result = await ContactCollection.findOneAndUpdate( {_id: contactId}, payload,  { 
    new: true, 
    upsert,
    includeResultMetadata: true,
   });
   if(!result || !result.value) return null;

   const isNew = Boolean(result.lastErrorObject?.upserted);
   return {
     isNew,
     contact: result.value,
   };
};

export const deleteContact = filter => ContactCollection.findOneAndDelete(filter);
