const router = require("express").Router();
const {
  createDataset,
  getUserOwnedDatasetById,
  getUserOwnedDatasets,
  getAllDatasets,
  getDatasetbyDatasetId,
  getVersion,
  versionBuyingTransaction,
} = require("../controllers/datasets.controller.js");

router.route("/owned").get(getUserOwnedDatasets);
router.route("/owned/:id").get(getUserOwnedDatasetById);
router.route("/create").post(createDataset);
//router.version("/version").get(getVersion);
router.route("/").get(getAllDatasets);
router.route("/:id_dataset/").get(getDatasetbyDatasetId);
router.route("/:id_dataset/:name_version").get(getVersion);
router.route("/:id_version").post(versionBuyingTransaction);
//router.route("/:slug").get(getDatasetbySlug);
// router.route("/version").get(getAllVersion);
// router.route("/version/:slug").get(getVersionBySlug);
//router.route("/:id").get(verifyToken, getOrder);

module.exports = router;
