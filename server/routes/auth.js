const router = require("express").Router();
const {
    loginUser,
    //createAccount,
} = require("../controllers/auth.controller.js");

//router.post("/signup", createAccount);
router.post("/login", loginUser);
//router.post("/forgot-password", forgotPassword);
module.exports = router;