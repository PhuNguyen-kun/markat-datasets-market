const RequestService = require("../services/requests.service");

const sendSellingRequest = async (req, res) => {
  const { id_seller,
    id_data_format,
    name_dataset,
    expected_price,
    evolution,
    description,
    data_requirements
  } = req.body;
  const request = await RequestService.createSellingRequest(
    id_seller,
    id_data_format,
    name_dataset,
    expected_price,
    evolution,
    description,
    data_requirements
  );
  return res.status(200).json(request);
};
const sendBuyingRequest = async (req, res) => {
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
  const request = await RequestService.createBuyingRequest(
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
  return res.status(200).json(request);
};
const getRequestsHistory = async (req, res) => {
  const { id_user } = req.body;
  const requests = await RequestService.getRequestsHistoryById(id_user);
  return res.status(200).json(requests);
};

const getAllSendingRequests = async (req, res) => {
  const { id } = req.body;
  const requests = await RequestService.getAllSendingRequestsById(id);
  return res.status(200).json(requests);
};

const getAllBuyingRequests = async (req, res) => {
  const { id } = req.body;
  const requests = await RequestService.getAllBuyingRequestsById(id);
  return res.status(200).json(requests);
};

module.exports = {
  sendSellingRequest,
  sendBuyingRequest,
  getRequestsHistory,
  getAllSendingRequests,
  getAllBuyingRequests,
  // getSendingRequests,
  // getBuyingRequests,
};
