const {
  getAllYourWorkVersionsByUserIdDb,
  getYourWorkDetailDb,
  getAllCollectionsByUserIdDb,
  getCollectionDetailDb,
} = require("../db/yourwork.db");

class YourWorkService {
  constructor(name) {
    this.name = name;
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (typeof this[key] === "function" && key !== "constructor") {
        this[key] = this[key].bind(this);
      }
    }
  }
  getAllYourWorkVersionsByUserId = async ({ id_user }) => {
    try {
      return await getAllYourWorkVersionsByUserIdDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  getYourWorkDetail = async ({ id_user, id_version }) => {
    try {
      return await getYourWorkDetailDb(id_user, id_version);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  getAllCollectionsByUserId = async ({ id_user }) => {
    try {
      return await getAllCollectionsByUserIdDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };

  getCollectionDetail = async ({ id_user, id_dataset }) => {
    try {
      return await getCollectionDetailDb(id_user, id_dataset);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}

module.exports = new YourWorkService();
