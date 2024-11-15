const RequestService = require("../services/requests.service");
const handleRequest = require("../helpers/handleRequest");

const sendSellingRequest = async (req, res, next) => {
  const {
    id_seller,
    id_data_format,
    name_dataset,
    expected_price,
    evolution,
    description,
    data_requirements,
  } = req.body;

  await handleRequest(
    RequestService.createSellingRequest,
    [
      id_seller,
      id_data_format,
      name_dataset,
      expected_price,
      evolution,
      description,
      data_requirements,
    ],
    res,
    next,
    "Selling request sent successfully",
    "Unable to send selling request"
  );
};

const sendBuyingRequest = async (req, res, next) => {
  const {
    id_buyer,
    id_data_format,
    name_dataset,
    deposit,
    price,
    due_date,
    public_data,
    description,
    data_requirements,
  } = req.body;

  await handleRequest(
    RequestService.createBuyingRequest,
    [
      id_buyer,
      id_data_format,
      name_dataset,
      deposit,
      price,
      due_date,
      public_data,
      description,
      data_requirements,
    ],
    res,
    next,
    "Buying request sent successfully",
    "Unable to send buying request"
  );
};

const getRequestsHistory = async (req, res, next) => {
  const { id_user } = req.query;
  if (!id_user) {
    return res.status(400).json({ status: "error", message: "User ID is required" });
  }
  await handleRequest(
    RequestService.getRequestsHistoryById,
    [id_user],
    res,
    next,
    "Request history retrieved successfully",
    "No request history found"
  );
};

const getDataFormat = async (req, res, next) => {
  await handleRequest(
    RequestService.getDataFormat,
    [],
    res,
    next,
    "Data format retrieved successfully",
    "Data format not found"
  );
};

module.exports = {
  sendSellingRequest,
  sendBuyingRequest,
  getRequestsHistory,
  getDataFormat,
};
