const { getAllYourWorkVersionsDb } = require("../db/yourwork.db");
const { ErrorHandler } = require("../helpers/error.js");
class YourWorkService {
  getAllYourWorkVersions = async (data) => {
    try {
      return await getAllYourWorkVersionsDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}
module.exports = new YourWorkService();
