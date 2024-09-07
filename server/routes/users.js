const { getUserProfile } = require("../controllers/users.controller");
const router = require("express").Router();

router.route("/profile").get(getUserProfile);
module.exports = router;
