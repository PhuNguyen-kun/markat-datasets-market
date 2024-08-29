const router = require("express").Router();
const users = require("./users");
const dataset = require("./dataset");

router.use("/users",users);
router.use("/dataset",dataset);

module.exports = router;