const {
    getUserProfile,
    getUserReliability,
} = require("../controllers/users.controller");
const router = require("express").Router();

router.route("/profile").get(getUserProfile);
router.route("/reliability").get(getUserReliability);
module.exports = router;
