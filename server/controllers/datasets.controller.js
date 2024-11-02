const e = require("express");
const datasetService = require("../services/datasets.service.js");

const createDataset = async (req, res) => {
  const { reliability_minimum, avatar, name_dataset, voucher, field } =
    req.body;

  const newDataset = await datasetService.createOrder({
    reliability_minimum,
    avatar,
    name_dataset,
    voucher,
    field,
  });

  res.status(201).json(newDataset);
};

const getAllDatasets = async (req, res) => {
  const { page } = req.body;
  const datasets = await datasetService.getAllDatasets(page);
  res.json(datasets);
};

const getUserOwnedDatasets = async (req, res) => {
  const { id, page = 1 } = req.body;
  const datasets = await datasetService.getUserOwnedDatasets(id, page);

  return res.status(200).json(datasets);
};

const getUserOwnedDatasetById = async (req, res) => {
  const { id } = req.body;
  const datasets = await datasetService.getUserOwnedDatasetById(id);

  return res.status(200).json(datasets);
};
const getDatasetbyDatasetId = async (req, res) => {
  const { id_dataset } = req.params;
  const dataset = await datasetService.getDatasetbyDatasetId(id_dataset);
  return res.status(200).json(dataset);
};
const getVersion = async (req, res) => {
  const { id_dataset, name_version } = req.params;
  const version = await datasetService.getVersion(id_dataset, name_version);
  return res.status(200).json(version);
};
const versionBuyingTransaction = async (req, res) => {
  const { id_version } = req.params;
  const { id_user } = req.body;
  const execute = await datasetService.versionBuyingTransaction(id_user, id_version);
  return res.status(200).json(execute);
}
module.exports = {
  createDataset,
  getAllDatasets,
  getUserOwnedDatasets,
  getUserOwnedDatasetById,
  getDatasetbyDatasetId,
  getVersion,
  versionBuyingTransaction,
};
