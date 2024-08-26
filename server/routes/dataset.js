const router = require("express").Router();
const {
    createDataset,
    getAllDatasets,
} = require("../controllers/datasets.controller.js");

router.route("/create").post(createDataset);

router.route("/").get(verifyToken, getAllDatasets);

//router.route("/:id").get(verifyToken, getOrder);

module.exports = router;