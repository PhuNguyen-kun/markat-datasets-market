const router = require("express").Router();
const {
  loginUser,
  createAccount,
  resetPassword,
} = require("../controllers/auth.controller.js");

router.post("/signup", createAccount);
router.post("/login", loginUser);
//router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;
