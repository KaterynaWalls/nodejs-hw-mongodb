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
    console.log("🔄 Спроба оновлення контакту:", contactId, payload);

    const result = await ContactCollection.findOneAndUpdate(
      { _id: contactId },
      payload,
      {
        new: true,
        ...options,
      },
    );

    if (!result) {
        console.log("❌ Контакт не знайдено:", contactId);
        return null;
    }
    console.log("✅ Контакт оновлено:", result);
    return result;
  };



export const deleteContact = filter => ContactCollection.findOneAndDelete(filter);
