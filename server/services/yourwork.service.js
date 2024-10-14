const { getAllYourWorkVersionsByIdDb } = require("../db/yourwork.db");
const { ErrorHandler } = require("../helpers/error.js");
class YourWorkService {
  getAllYourWorkVersionsById = async (data) => {
    try {
      return await getAllYourWorkVersionsByIdDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}
module.exports = new YourWorkService();
