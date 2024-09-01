const router = require("express").Router();
const auth = require("./auth");
const users = require("./users");
const datasets = require("./datasets");
const requests = require("./requests");

router.use("/auth", auth);
router.use("/users", users);
router.use("/datasets", datasets);
router.use("/requests", requests);
module.exports = router;
