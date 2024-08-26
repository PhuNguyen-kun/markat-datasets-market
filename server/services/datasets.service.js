const {
    getAllDatasetsDb,
    //getDatasetDb,
    createDatasetDb,
} = require("../db/datasets.db.js");

class DatasetService {
    createDataset = async (data) => {
        try {
          return await createDatasetDb(data);
        } catch (error) {
          throw new ErrorHandler(error.statusCode, error.message);
        }
    };
    getAllDatasets = async (page) => {
        const limit = 5;
        offset = (page - 1) * limit;
        try {
            return await getAllDatasetsDb({limit, offset });
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
}

module.exports = new DatasetService();