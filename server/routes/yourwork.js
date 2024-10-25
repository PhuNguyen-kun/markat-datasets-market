const router = require("express").Router();
const {
  getAllYourWorkVersionsByUserId,
} = require("../controllers/yourwork.controller");
router.route("/").get(getAllYourWorkVersionsByUserId);

module.exports = router;
