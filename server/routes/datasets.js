const router = require("express").Router();
const {
  createDataset,
  getAllDatasets,
  getUserOwnedDataset,
  getUserOwnedDatasets,
} = require("../controllers/datasets.controller.js");

router.route("/owned").get(getUserOwnedDatasets);
//router.route("/owned/:id").get(getUserOwnedDataset);
router.route("/create").post(createDataset);
router.route("/").get(getAllDatasets);

//router.route("/:id").get(verifyToken, getOrder);

module.exports = router;
