const {
  createSendingRequestDb,
  createBuyingRequestDb,
  getRequestsHistoryByIdDb,
  getSendingRequestsByIdDb,
  getBuyingRequestsByIdDb,
} = require("../db/requests.db.js");
const { ErrorHandler } = require("../helpers/error");

class RequestService {
  createSendingRequest = async (
    id_user,
    data_type,
    id_dataset,
    description
  ) => {
    try {
      return await createSendingRequestDb(
        id_user,
        data_type,
        id_dataset,
        description
      );
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  createBuyingRequest = async (
    id_user,
    id_dataset,
    description,
    deposit,
    price,
    due_date,
    data_type
  ) => {
    try {
      return await createBuyingRequestDb(
        id_user,
        id_dataset,
        description,
        deposit,
        price,
        due_date,
        data_type
      );
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getRequestsHistoryById = async (id_user) => {
    try {
      return await getRequestsHistoryByIdDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getAllSendingRequests = async (id) => {
    try {
      return await getSendingRequestsByIdDb(id);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getAllBuyingRequests = async (id) => {
    try {
      return await getBuyingRequestsByIdDb(id);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}

module.exports = new RequestService();
