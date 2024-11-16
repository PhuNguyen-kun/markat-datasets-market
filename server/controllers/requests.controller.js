const RequestService = require("../services/requests.service");
const { handleRequest } = require("../helpers/error");

const sendSellingRequest = async (req, res, next) => {
  await handleRequest(
    RequestService.createSellingRequest,
    [req.body],
    res,
    next,
    [
      "id_seller",
      "id_data_format",
      "name_dataset",
      "expected_price",
      "evolution",
      "description",
      "data_requirements",
    ],
    "Selling request sent successfully",
    "Unable to send selling request"
  );
};

const sendBuyingRequest = async (req, res, next) => {
  await handleRequest(
    RequestService.createBuyingRequest,
    [req.body],
    res,
    next,
    [
      "id_buyer",
      "id_data_format",
      "name_dataset",
      "deposit",
      "price",
      "due_date",
      "public_data",
      "description",
      "data_requirements",
    ],
    "Buying request sent successfully",
    "Unable to send buying request"
  );
};

const getRequestsHistory = async (req, res, next) => {
  await handleRequest(
    RequestService.getRequestsHistoryById,
    [req.query],
    res,
    next,
    ["id_user"],
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
    [],
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
