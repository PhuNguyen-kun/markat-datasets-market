const jwt = require("jsonwebtoken");
require("dotenv").config();
const authService = require("../services/auth.service.js");

const createAccount = async (req, res) => {
  const { user } = await authService.signUp(req.body);
  res.status(200).json({
    user,
  });
};

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   const { user } = await authService.login(email, password);
//   res.status(200).json({
//     user,
//   });
// };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user } = await authService.login(email, password);
    const access_token = jwt.sign(
      { user_id: user.user_id, full_name: user.full_name, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      },
      access_token,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  res.json({ status: "OK" });
};

const resetPassword = async (req, res) => {
  const { password, password2, email } = req.body;

  await authService.resetPassword(password, password2, email);

  res.json({
    status: "OK",
    message: "Password reset. Please login with your new password.",
  });
};

module.exports = {
  createAccount,
  loginUser,
  //forgotPassword,
  resetPassword,
};
