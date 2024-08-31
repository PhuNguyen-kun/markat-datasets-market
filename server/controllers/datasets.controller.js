const datasetService = require("../services/datasets.service.js");

const createDataset = async (req, res) => {
    const { reliability_minimum, avatar, name_dataset, voucher,field } = req.body;

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

module.exports = {
    createDataset,
    getAllDatasets,
};
