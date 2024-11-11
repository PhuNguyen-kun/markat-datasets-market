const router = require("express").Router();
const {
    getVersionPartsDetail,
    getDatas,
    labelData
} = require("../controllers/labeling.controller");
router.route("/label").patch(labelData);
router.route("/datas").get(getDatas);
router.route("/").get(getVersionPartsDetail);
module.exports = router;