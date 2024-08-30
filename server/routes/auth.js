const router = require("express").Router();
const {
    loginUser,
} = require("../controllers/auth.controller.js");

router.post("/login", loginUser);
//router.post("/forgot-password", forgotPassword);
module.exports = router;