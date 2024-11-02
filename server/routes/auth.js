const router = require("express").Router();
const {
  loginUser,
  createAccount,
  resetPassword,
  logoutUser,
} = require("../controllers/auth.controller.js");
const verifyToken = require("../middleware/auth.middleware.js");

router.post("/signup", createAccount);
router.post("/login", loginUser);
//router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.userId });
});
router.post("/auth/logout", verifyToken, logoutUser);

module.exports = router;
