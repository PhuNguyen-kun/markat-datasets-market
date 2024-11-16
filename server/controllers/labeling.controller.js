const LabelingService = require("../services/labeling.service");
const { handleRequest } = require("../helpers/error");

const getVersionPartsDetail = async (req, res, next) => {
  await handleRequest(
    LabelingService.getVersionPartsDetail,
    [req.query],
    res,
    next,
    ["id_user", "id_version"], // Các trường bắt buộc
    "Version parts detail retrieved successfully.",
    "Version parts detail not found."
  );
};

const getDatas = async (req, res, next) => {
  await handleRequest(
    LabelingService.getDatas,
    [req.query],
    res,
    next,
    ["id_user", "id_part"], // Các trường bắt buộc
    "Datas retrieved successfully.",
    "Datas not found."
  );
};

const labelData = async (req, res, next) => {
  await handleRequest(
    LabelingService.labelData,
    [req.body],
    res,
    next,
    ["id_data", "id_labeler", "label"], // Các trường bắt buộc
    "Data labeled successfully.",
    "Data labeling failed."
  );
};

module.exports = {
  getVersionPartsDetail,
  getDatas,
  labelData,
};
