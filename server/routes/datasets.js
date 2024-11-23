const router = require("express").Router();
const {
  createDataset,
  getUserOwnedDatasetById,
  getUserOwnedDatasets,
  getDatasetsByTopic,
  getDatasetbyDatasetId,
  getVersion,
  versionBuyingTransaction,
} = require("../controllers/datasets.controller.js");

router.route("/owned/:id_user/:page").get(getUserOwnedDatasets);
router.route("/owned/:id").get(getUserOwnedDatasetById);
router.route("/create").post(createDataset);
//router.version("/version").get(getVersion);
router.route("/").get(getDatasetsByTopic);
router.route("/:id_dataset/").get(getDatasetbyDatasetId);
router.route("/version/:id_version").get(getVersion);
router.route("/buying/:id_version").post(versionBuyingTransaction);
//router.route("/:slug").get(getDatasetbySlug);
// router.route("/version").get(getAllVersion);
// router.route("/version/:slug").get(getVersionBySlug);
//router.route("/:id").get(verifyToken, getOrder);

module.exports = router;
