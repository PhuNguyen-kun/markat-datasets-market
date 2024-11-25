const router = require("express").Router();
const {
  createDataset,
  getUserOwnedDatasetById,
  getUserOwnedDatasets,
  getDatasetsByTopic,
  getDatasetbyDatasetId,
  getVersion,
  versionBuyingTransaction,
  updateDatasetView,
} = require("../controllers/datasets.controller.js");
const verifyToken = require("../middleware/verifyToken.js");
// Routes liên quan đến datasets
router.route("/").get(getDatasetsByTopic); // Lấy danh sách datasets theo topic
// router.route("/create").post(verifyToken, createDataset); // Tạo dataset
router.route("/:id_dataset").get(getDatasetbyDatasetId); // Lấy thông tin dataset theo id

// // Routes liên quan đến user owned datasets
router.route("/owned/:id_user/:page").get(getUserOwnedDatasets); // Lấy danh sách datasets của user
router.route("/owned/:id").get(getUserOwnedDatasetById); // Lấy dataset cụ thể của user

// // Routes liên quan đến versions
router.route("/version/:id_version").get(getVersion); // Lấy thông tin version theo id
router.route("/buying/:id_version").post(versionBuyingTransaction); // Thực hiện giao dịch mua version

// Routes liên quan đến views
router.route("/view").post(verifyToken, updateDatasetView); // Cập nhật số lượt xem

module.exports = router;
