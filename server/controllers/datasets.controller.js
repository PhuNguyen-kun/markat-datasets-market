const datasetService = require("../services/datasets.service.js");
const handleRequest = require("../helpers/handleRequest");

const createDataset = async (req, res, next) => {
  const { reliability_minimum, avatar, name_dataset, voucher, field } = req.body;

  if (!name_dataset || !reliability_minimum) {
    return res.status(400).json({
      status: "error",
      message: "Dataset name and reliability minimum are required.",
    });
  }

  await handleRequest(
    datasetService.createDataset,
    [{ reliability_minimum, avatar, name_dataset, voucher, field }],
    res,
    next,
    "Dataset created successfully.",
    "Failed to create dataset."
  );
};

const getAllDatasets = async (req, res, next) => {
  const { page = 1 } = req.query;

  await handleRequest(
    datasetService.getAllDatasets,
    [page],
    res,
    next,
    "Datasets retrieved successfully.",
    "No datasets found."
  );
};

const getUserOwnedDatasets = async (req, res, next) => {
  const { id_user } = req.params;
  const { page = 1 } = req.query;

  if (!id_user) {
    return res.status(400).json({
      status: "error",
      message: "User ID is required.",
    });
  }

  await handleRequest(
    datasetService.getUserOwnedDatasets,
    [id_user, page],
    res,
    next,
    "User-owned datasets retrieved successfully.",
    "User-owned datasets not found."
  );
};

const getUserOwnedDatasetById = async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Dataset ID is required.",
    });
  }

  await handleRequest(
    datasetService.getUserOwnedDatasetById,
    [id],
    res,
    next,
    "User-owned dataset retrieved successfully.",
    "User-owned dataset not found."
  );
};

const getDatasetbyDatasetId = async (req, res, next) => {
  const { id_dataset } = req.params;

  if (!id_dataset) {
    return res.status(400).json({
      status: "error",
      message: "Dataset ID is required.",
    });
  }

  await handleRequest(
    datasetService.getDatasetbyDatasetId,
    [id_dataset],
    res,
    next,
    "Dataset retrieved successfully.",
    "Dataset not found."
  );
};

const getVersion = async (req, res, next) => {
  const { id_dataset, name_version } = req.params;

  if (!id_dataset || !name_version) {
    return res.status(400).json({
      status: "error",
      message: "Dataset ID and version name are required.",
    });
  }

  await handleRequest(
    datasetService.getVersion,
    [id_dataset, name_version],
    res,
    next,
    "Version retrieved successfully.",
    "Version not found."
  );
};

const versionBuyingTransaction = async (req, res, next) => {
  const { id_version } = req.params;
  const { id_user } = req.body;

  if (!id_version || !id_user) {
    return res.status(400).json({
      status: "error",
      message: "Version ID and user ID are required.",
    });
  }

  await handleRequest(
    datasetService.versionBuyingTransaction,
    [id_user, id_version],
    res,
    next,
    "Version buying transaction executed successfully.",
    "Version buying transaction failed."
  );
};

module.exports = {
  createDataset,
  getAllDatasets,
  getUserOwnedDatasets,
  getUserOwnedDatasetById,
  getDatasetbyDatasetId,
  getVersion,
  versionBuyingTransaction,
};
