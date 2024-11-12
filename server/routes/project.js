const router = require("express").Router();
const {
    getAllProjects,
    getProjectDetail
} = require("../controllers/project.controller.js");

router.route("/project_detail").get(getProjectDetail);
router.route("/").get(getAllProjects);
module.exports = router;