const {
  getUserProfile,
  getUserReliability,
  getUserKat,
} = require("../controllers/users.controller");
const router = require("express").Router();

router.route("/profile").get(getUserProfile);
router.route("/reliability").get(getUserReliability);
router.route("/kat").get(getUserKat);
module.exports = router;
