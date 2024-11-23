const router = require("express").Router();
const {
    getProjectsByTopic,
    getProjectDetail,
} = require("../controllers/project.controller.js");

router.route("/project_detail").get(getProjectDetail);
router.route("/").get(getProjectsByTopic);
module.exports = router;