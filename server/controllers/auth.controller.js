const authService = require("../services/auth.service.js");

const loginUser = async (req, res) => {
    const {email, password } = req.body;
    const { user } = await authService.login(
      email,
      password
    );
    res.status(200).json({
      user,
    });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  res.json({ status: "OK" });
};

const createAccount = async (req,res) => {
  const {user} = await authService.signUp(req.body);
  res.status(200).json({
    user,
  });
}

module.exports = {
  loginUser,
  forgotPassword,
  createAccount,
};