const router = require("express").Router();
const {
  getAllYourWorkVersionsById,
} = require("../controllers/yourwork.controller");
router.route("/").get(getAllYourWorkVersionsById);

module.exports = router;
