const { getAllYourWorkVersionsByUserIdDb } = require("../db/yourwork.db");
const { ErrorHandler } = require("../helpers/error.js");
class YourWorkService {
  getAllYourWorkVersionsByUserId = async (user_id) => {
    try {
      return await getAllYourWorkVersionsByUserIdDb(user_id);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}
module.exports = new YourWorkService();
