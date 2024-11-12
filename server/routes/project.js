const router = require("express").Router();
const {
    getAllProjects,
} = require("../controllers/project.controller.js");

router.route("/").get(getAllProjects);
module.exports = router;