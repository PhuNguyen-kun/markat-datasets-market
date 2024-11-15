const {
  getAllYourWorkVersionsByUserIdDb,
  getYourWorkDetailDb,
  getAllCollectionsByUserIdDb,
  getCollectionDetailDb,
} = require("../db/yourwork.db");
const { ErrorHandler } = require("../helpers/error.js");

class YourWorkService {
  handleDatabaseCall = async (dbFunction, params) => {
    try {
      return await dbFunction(...params);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || "Database call failed");
    }
  };

  getAllYourWorkVersionsByUserId = async (id_user) => {
    return this.handleDatabaseCall(getAllYourWorkVersionsByUserIdDb, [id_user]);
  };

  getYourWorkDetail = async (id_user, id_version) => {
    return this.handleDatabaseCall(getYourWorkDetailDb, [id_user, id_version]);
  };

  getAllCollectionsByUserId = async (id_user) => {
    return this.handleDatabaseCall(getAllCollectionsByUserIdDb, [id_user]);
  };

  getCollectionDetail = async (id_user, id_dataset) => {
    return this.handleDatabaseCall(getCollectionDetailDb, [id_user, id_dataset]);
  };
}

module.exports = new YourWorkService();
