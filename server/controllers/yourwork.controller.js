const YourWorkService = require("../services/yourwork.service");
const handleRequest = require("../helpers/handleRequest");

const getAllYourWorkVersionsByUserId = async (req, res, next) => {
  const { id_user } = req.query;
  if (!id_user) {
    return res.status(400).json({ status: "error", message: "User ID is required" });
  }
  await handleRequest(
    YourWorkService.getAllYourWorkVersionsByUserId,
    [id_user],
    res,
    next,
    "Work versions retrieved successfully",
    "Work versions not found"
  );
};

const getYourWorkDetail = async (req, res, next) => {
  const { id_user, id_version } = req.query;
  if (!id_user || !id_version) {
    return res.status(400).json({
      status: "error",
      message: "User ID and Version ID are required",
    });
  }
  await handleRequest(
    YourWorkService.getYourWorkDetail,
    [id_user, id_version],
    res,
    next,
    "Work detail retrieved successfully",
    "Work detail not found"
  );
};

const getAllCollectionsByUserId = async (req, res, next) => {
  const { id_user } = req.query;
  if (!id_user) {
    return res.status(400).json({ status: "error", message: "User ID is required" });
  }
  await handleRequest(
    YourWorkService.getAllCollectionsByUserId,
    [id_user],
    res,
    next,
    "Collections retrieved successfully",
    "Collections not found"
  );
};

const getCollection = async (req, res, next) => {
  const { id_user, id_dataset } = req.query;
  if (!id_user || !id_dataset) {
    return res.status(400).json({
      status: "error",
      message: "User ID and Dataset ID are required",
    });
  }
  await handleRequest(
    YourWorkService.getCollectionDetail,
    [id_user, id_dataset],
    res,
    next,
    "Collection detail retrieved successfully",
    "Collection detail not found"
  );
};

module.exports = {
  getAllYourWorkVersionsByUserId,
  getYourWorkDetail,
  getAllCollectionsByUserId,
  getCollection,
};
