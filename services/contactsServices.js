import { Contact } from "../schemas/contactsSchemas.js";

async function listContacts(skip = 0, limit = 10, favorite = false) {
  if (favorite) {
    const data = await Contact.find({ favorite }, "", { skip, limit });
    return data;
  } else {
    const data = await Contact.find({}, "", { skip, limit });
    return data;
  }
}

async function getContactById(contactId) {
  const contactFoundById = await Contact.findById(contactId);
  return contactFoundById;
}

async function removeContact(contactId) {
  const contactToDelete = await Contact.findByIdAndDelete(contactId);
  return contactToDelete;
}

async function addContact(name, email, phone, favorite = false) {
  const addedContact = await Contact.create({ name, email, phone, favorite });
  return addedContact;
}

const updateContact = async ({ name, email, phone, favorite }, contactId) => {
  const updatedContact = await Contact.updateOne(
    { _id: contactId },
    { name, email, phone, favorite }
  );
  return updatedContact;
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
