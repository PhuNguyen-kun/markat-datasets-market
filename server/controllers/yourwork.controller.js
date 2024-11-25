const YourWorkService = require("../services/yourwork.service");
const { handleRequest } = require("../helpers/error");

const getAllYourWorkVersionsByUserId = async (req, res, next) => {
  const { id_user } = req.query;
  console.log("Received id_user:", id_user);
  if (!id_user) {
    return res
      .status(400)
      .json({ status: "error", message: "User ID is required" });
  }
  await handleRequest(
    YourWorkService.getAllYourWorkVersionsByUserId,
    [req.query],
    res,
    next,
    [["id_user"]],
    "Work versions retrieved successfully",
    "Work versions not found"
  );
};

const getYourWorkDetail = async (req, res, next) => {
  await handleRequest(
    YourWorkService.getYourWorkDetail,
    [req.query],
    res,
    next,
    [["id_user", "id_version"]],
    "Work detail retrieved successfully",
    "Work detail not found"
  );
};

const getAllCollectionsByUserId = async (req, res, next) => {
  await handleRequest(
    YourWorkService.getAllCollectionsByUserId,
    [req.query],
    res,
    next,
    [["id_user"]],
    "Collections retrieved successfully",
    "Collections not found"
  );
};

const getCollection = async (req, res, next) => {
  await handleRequest(
    YourWorkService.getCollectionDetail,
    [req.query],
    res,
    next,
    [["id_user", "id_dataset"]],
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
