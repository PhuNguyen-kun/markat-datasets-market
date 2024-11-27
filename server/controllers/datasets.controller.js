const datasetService = require("../services/datasets.service.js");
const { handleRequest } = require("../helpers/error");

const createDataset = async (req, res, next) => {
  await handleRequest(
    datasetService.createDataset,
    [req.body],
    res,
    next,
    [["reliability_minimum", "name_dataset"]],
    "Dataset created successfully.",
    "Failed to create dataset."
  );
};

const getDatasetsByTopic = async (req, res, next) => {
  await handleRequest(
    datasetService.getDatasetsByTopic,
    [req.query],
    res,
    next,
    [["quantity", "topic"]],
    "Datasets retrieved successfully.",
    "No datasets found."
  );
};

const getUserOwnedDatasets = async (req, res, next) => {
  await handleRequest(
    datasetService.getUserOwnedDatasets,
    [{ id_user: req.params.id_user, page: req.query.page }],
    res,
    next,
    [["id_user"]],
    "User-owned datasets retrieved successfully.",
    "User-owned datasets not found."
  );
};

const getUserOwnedDatasetById = async (req, res, next) => {
  await handleRequest(
    datasetService.getUserOwnedDatasetById,
    [req.body],
    res,
    next,
    [["id"]],
    "User-owned dataset retrieved successfully.",
    "User-owned dataset not found."
  );
};

const getDatasetbyDatasetSlug = async (req, res, next) => {
  await handleRequest(
    datasetService.getDatasetbyDatasetSlug,
    [{ slug: req.params.slug }],
    res,
    next,
    [["slug"]],
    "Dataset retrieved successfully.",
    "Dataset not found."
  );
};

const getDatasetbyDatasetId = async (req, res, next) => {
  await handleRequest(
    datasetService.getDatasetbyDatasetId,
    [{ id_dataset: req.params.id_dataset }],
    res,
    next,
    [["id_dataset"]],
    "Dataset retrieved successfully.",
    "Dataset not found."
  );
};

const getVersion = async (req, res, next) => {
  await handleRequest(
    datasetService.getVersion,
    [{ id_version: req.params.id_version }],
    res,
    next,
    [["id_version"]],
    "Version retrieved successfully.",
    "Version not found."
  );
};

const versionBuyingTransaction = async (req, res, next) => {
  await handleRequest(
    datasetService.versionBuyingTransaction,
    [{ id_user: req.body.id_user, id_version: req.params.id_version }],
    res,
    next,
    [["id_user", "id_version"]],
    "Version buying transaction executed successfully.",
    "Version buying transaction failed."
  );
};

const updateDatasetView = async (req, res, next) => {
   await handleRequest(
    datasetService.updateDatasetView,
    [req.body, req.id_user],
    res,
    next,
    [["id_dataset"], ["id_user"]],
    "Update dataset view executed successfully.",
    "Update dataset view transaction failed."
  );
}

module.exports = {
  createDataset,
  getDatasetsByTopic,
  getUserOwnedDatasets,
  getUserOwnedDatasetById,
  getDatasetbyDatasetSlug,
  getDatasetbyDatasetId,
  getVersion,
  versionBuyingTransaction,
  updateDatasetView,
};
