import { promises as fs } from "fs";

async function listContacts() {
  const data = await fs
    .readFile("D:/Users/Yarei/Desktop/goit-node-rest-api/db/contacts.json")
    .then((bufferedData) => JSON.parse(bufferedData.toString()))
    .catch((error) => console.log("error", error));

  if (data) {
    return { data, status: 200 };
  }
  return { status: 404 };
}

async function getContactById(contactId) {
  const data = await fs
    .readFile("D:/Users/Yarei/Desktop/goit-node-rest-api/db/contacts.json")
    .then((bufferedData) => JSON.parse(bufferedData.toString()))
    .catch((error) => console.log("error", error));

  const foundData = data.find((contact) => contact.id === contactId);
  if (foundData) {
    return { foundData, status: 200 };
  } else {
    return { status: 404 };
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs
      .readFile("D:/Users/Yarei/Desktop/goit-node-rest-api/db/contacts.json")
      .then((bufferedData) => JSON.parse(bufferedData.toString()))
      .catch((error) => console.log("error of parsing data", error));
    const foundData = data.find((contact) => contact.id === contactId);
    if (foundData) {
      const filteredData = data.filter((contact) => contact.id !== contactId);

      try {
        fs.writeFile(
          "D:/Users/Yarei/Desktop/goit-node-rest-api/db/contacts.json",
          JSON.stringify(filteredData)
        );
      } catch (error) {
        console.log("error of writing file", error);
      }
      return { foundData, status: 200 };
    } else {
      return { status: 404 };
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fs
      .readFile("D:/Users/Yarei/Desktop/goit-node-rest-api/db/contacts.json")
      .then((bufferedData) => JSON.parse(bufferedData.toString()))
      .catch((error) => console.log("error of parsing data", error));

    const quantityOfContacts = data.length;

    try {
      fs.writeFile(
        "D:/Users/Yarei/Desktop/goit-node-rest-api/db/contacts.json",
        JSON.stringify([
          ...data,
          {
            id: `${quantityOfContacts + 1}`,
            name,
            email,
            phone,
          },
        ])
      );
      return {
        id: `${quantityOfContacts + 1}`,
        name,
        email,
        phone,
      };
    } catch (error) {
      console.log("error of writing file", error);
    }
  } catch (error) {
    console.log("error", error);
  }
}

const updateContact = async (data, id) => {
  try {
    const fileData = await fs
      .readFile("D:/Users/Yarei/Desktop/goit-node-rest-api/db/contacts.json")
      .then((bufferedData) => JSON.parse(bufferedData.toString()))
      .catch((error) => console.log("error of parsing data", error));

    const foundData = fileData.find((contact) => contact.id === id);
    if (foundData) {
      const contacts = fileData.map((contact) => {
        if (contact.id !== id) {
          return contact;
        }
        return {
          ...foundData,
          ...data,
        };
      });
      try {
        fs.writeFile(
          "D:/Users/Yarei/Desktop/goit-node-rest-api/db/contacts.json",
          JSON.stringify([...contacts])
        );
      } catch (error) {
        console.log("error has occured while writing a file ", error);
      }
      return { foundData, status: 200 };
    } else {
      return { message: "Not Found", status: 404 };
    }
  } catch (error) {
    console.log("error", error);
  }
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
