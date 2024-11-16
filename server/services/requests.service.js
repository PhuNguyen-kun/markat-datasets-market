const {
  createSellingRequestDb,
  createBuyingRequestDb,
  getRequestsHistoryByIdDb,
  getSendingRequestsByIdDb,
  getBuyingRequestsByIdDb,
  getDataFormatDb,
} = require("../db/requests.db.js");
const { ErrorHandler } = require("../helpers/error");

class RequestService {
  constructor(name) {
    this.name = name;
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (typeof this[key] === "function" && key !== "constructor") {
        this[key] = this[key].bind(this);
      }
    }
  }
  createSellingRequest = async (
    { id_seller,
      id_data_format,
      name_dataset,
      expected_price,
      evolution,
      description,
      data_requirements }
  ) => {
    try {
      return await createSellingRequestDb(
        id_seller,
        id_data_format,
        name_dataset,
        expected_price,
        evolution,
        description,
        data_requirements
      );
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  createBuyingRequest = async (
    { id_buyer,
      id_data_format,
      name_dataset,
      deposit,
      price,
      due_date,
      public_data,
      description,
      data_requirements, }
  ) => {
    try {
      return await createBuyingRequestDb(
        id_buyer,
        id_data_format,
        name_dataset,
        deposit,
        price,
        due_date,
        public_data,
        description,
        data_requirements,
      );
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getRequestsHistoryById = async ({ id_user }) => {
    try {
      return await getRequestsHistoryByIdDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getAllSendingRequests = async ({ id }) => {
    try {
      return await getSendingRequestsByIdDb(id);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getAllBuyingRequests = async ({ id }) => {
    try {
      return await getBuyingRequestsByIdDb(id);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getDataFormat = async () => {
    try {
      return await getDataFormatDb();
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  }
}

module.exports = new RequestService();
