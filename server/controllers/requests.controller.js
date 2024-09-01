const RequestService = require("../services/requests.service");

const sendSendingRequest = async (req, res) => {
  const { id_user, data_type, id_dataset, description } = req.body;
  const request = await RequestService.createSendingRequest(
    id_user,
    data_type,
    id_dataset,
    description
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
  sendSendingRequest,
  getRequestsHistory,
  getAllSendingRequests,
  getAllBuyingRequests,
  // getSendingRequests,
  // getBuyingRequests,
};
