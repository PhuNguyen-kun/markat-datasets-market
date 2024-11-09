const {
    getVersionPartsDetailDb,
    getDatasDb,
} = require("../db/labeling.db");
const { ErrorHandler } = require("../helpers/error.js");
class LabelingService {
    getVersionPartsDetail = async (id_user, id_version) => {
        try {
            return await getVersionPartsDetailDb(id_user, id_version);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    getDatas = async (id_user, id_part) => {
        try {
            return await getDatasDb(id_user, id_part);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
}

module.exports = new LabelingService();