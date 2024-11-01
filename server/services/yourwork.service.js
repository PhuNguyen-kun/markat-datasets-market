const { getAllYourWorkVersionsByUserIdDb } = require("../db/yourwork.db");
const { ErrorHandler } = require("../helpers/error.js");
class YourWorkService {
  getAllYourWorkVersionsByUserId = async (id_user) => {
    try {
      return await getAllYourWorkVersionsByUserIdDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}
module.exports = new YourWorkService();
