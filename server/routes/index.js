const router = require("express").Router();
const auth = require("./auth");
const users = require("./users");
const dataset = require("./dataset");

router.use("/auth", auth);
router.use("/users",users);
router.use("/dataset",dataset);

module.exports = router;