const router = require("express").Router();
const auth = require("./auth");
const users = require("./users");
const datasets = require("./datasets");

router.use("/auth", auth);
router.use("/users",users);
router.use("/datasets",datasets);

module.exports = router;