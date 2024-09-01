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
  const { page = 1 } = req.query;

  const datasets = await datasetService.getAllDatasets(page);
  res.json(datasets);
};

const getUserOwnedDatasets = async (req, res) => {
  const { id, page = 1 } = req.body;
  const datasets = await datasetService.getUserOwnedDatasets(id, page);

  return res.status(200).json(datasets);
};

const getUserOwnedDataset = async (req, res) => {
  const { id } = req.body;
  const datasets = await datasetService.getUserOwnedDatasets(id);

  return res.status(200).json(datasets);
};

module.exports = {
  createDataset,
  getAllDatasets,
  getUserOwnedDatasets,
};
