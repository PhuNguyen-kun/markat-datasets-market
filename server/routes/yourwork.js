const router = require("express").Router();
const {
  getAllYourWorkVersions,
} = require("../controllers/yourwork.controller");
router.route("/").get(getAllYourWorkVersions);

module.exports = router;
