const {
  getAllDatasetsDb,
  getDatasetbyDatasetIdDb,
  createDatasetDb,
  getUserOwnedDatasetsDb,
  getVersionDb,
  versionBuyingTransactionDb,
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
  getDatasetbyDatasetId = async (id_dataset) => {
    try {
      return await getDatasetbyDatasetIdDb(id_dataset);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getUserOwnedDatasets = async (id_user) => {
    try {
      return await getUserOwnedDatasetsDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getUserOwnedDatasetById = async (datasetId) => {
    try {
      return await getUserOwnedDatasetByIdDb(datasetId);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getVersion = async (id_dataset, name_version) => {
    try {
      return await getVersionDb(id_dataset, name_version);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  versionBuyingTransaction = async (id_user, id_version) => {
    try {
      return await versionBuyingTransactionDb(id_user, id_version);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  }
}
module.exports = new DatasetService();
