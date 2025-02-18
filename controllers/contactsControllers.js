import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  const { limit, page, favorite } = req.query;
  const skip = (page - 1) * limit;

  try {
    const contacts = await contactsService.listContacts(skip, limit, favorite);
    res.status(200).json({
      status: "OK",
      code: 200,
      data: contacts,
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contact = await contactsService.getContactById(id);
    res.status(200).json({
      status: "OK",
      code: 200,
      data: contact,
      message: "success",
    });

    if (!contact) {
      throw HttpError(404, "Not Found");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contact = await contactsService.removeContact(id);

    if (!contact) {
      throw HttpError(404, "Not Found");
    }
    res.status(200).json({
      status: "Deleted",
      code: 200,
      data: contact,
      message: "Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const { error } = createContactSchema.validate({
      name,
      email,
      phone,
      favorite,
    });

    if (error) {
      throw HttpError(400, error.message);
    }
    const createdContact = await contactsService.addContact(name, email, phone);
    res.status(201).json({
      status: "Created",
      code: 201,
      data: createdContact,
      message: "Created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const { error } = updateContactSchema.validate({
      name,
      email,
      phone,
      favorite,
    });
    if (error) {
      throw HttpError(400, "Bad Rquest");
    }
    const id = req.params.id;
    const contact = await contactsService.updateContact(
      { name, email, phone, favorite },
      id
    );

    if (!contact) {
      throw HttpError(404, "Not Found");
    }

    res.status(200).json({
      status: "Updated",
      code: 200,
      data: contact,
      message: "Updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
