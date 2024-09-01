const {
  getAllDatasetsDb,
  //getDatasetDb,
  createDatasetDb,
  getUserOwnedDatasetsDb,
} = require("../db/datasets.db.js");
const { ErrorHandler } = require("../helpers/error");
class DatasetService {
  createDataset = async (data) => {
    try {
      return await createDatasetDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getAllDatasets = async (page) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    try {
      return await getAllDatasetsDb({ limit, offset });
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getUserOwnedDatasets = async (userId) => {
    try {
      return await getUserOwnedDatasetsDb(userId);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}

module.exports = new DatasetService();
