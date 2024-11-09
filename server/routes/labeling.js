const router = require("express").Router();
const {
    getVersionPartsDetail,
    getDatas
} = require("../controllers/labeling.controller");
router.route("/datas").get(getDatas);
router.route("/").get(getVersionPartsDetail);
module.exports = router;