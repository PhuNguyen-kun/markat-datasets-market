const router = require("express").Router();
const auth = require("./auth");
const users = require("./users");
const datasets = require("./datasets");
const requests = require("./requests");
const yourwork = require("./yourwork");
const labeling = require("./labeling");
const project = require("./project");

router.use("/auth", auth);
router.use("/users", users);
router.use("/datasets", datasets);
router.use("/requests", requests);
router.use("/yourwork", yourwork);
router.use("/labeling", labeling);
router.use("/project", project);
module.exports = router;
