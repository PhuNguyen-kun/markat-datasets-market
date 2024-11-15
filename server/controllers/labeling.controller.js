const LabelingService = require("../services/labeling.service");
const handleRequest = require("../helpers/handleRequest");

const getVersionPartsDetail = async (req, res, next) => {
  const { id_user, id_version } = req.query;

  if (!id_user || !id_version) {
    return res.status(400).json({
      status: "error",
      message: "User ID and Version ID are required.",
    });
  }

  await handleRequest(
    LabelingService.getVersionPartsDetail,
    [id_user, id_version],
    res,
    next,
    "Version parts detail retrieved successfully.",
    "Version parts detail not found."
  );
};

const getDatas = async (req, res, next) => {
  const { id_user, id_part } = req.query;

  if (!id_user || !id_part) {
    return res.status(400).json({
      status: "error",
      message: "User ID and Part ID are required.",
    });
  }

  await handleRequest(
    LabelingService.getDatas,
    [id_user, id_part],
    res,
    next,
    "Datas retrieved successfully.",
    "Datas not found."
  );
};

const labelData = async (req, res, next) => {
  const { id_data, id_labeler, label } = req.body;

  if (!id_data || !id_labeler || !label) {
    return res.status(400).json({
      status: "error",
      message: "Data ID, Labeler ID, and Label are required.",
    });
  }

  await handleRequest(
    LabelingService.labelData,
    [id_data, id_labeler, label],
    res,
    next,
    "Data labeled successfully.",
    "Data labeling failed."
  );
};

module.exports = {
  getVersionPartsDetail,
  getDatas,
  labelData,
};
