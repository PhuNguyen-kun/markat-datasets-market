const { route } = require("express/lib/router");
const {
    getUserProfile,
} = require("../controllers/users.controller");

router.route("/profile").get(getUserProfile);
module.exports = router;