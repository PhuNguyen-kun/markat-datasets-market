const authService = require("../services/auth.service.js");

const loginUser = async (req, res) => {
    const { phone_number, password } = req.body;
    console.log(phone_number);
    const { user } = await authService.login(
      phone_number,
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

module.exports = {
  loginUser,
  forgotPassword,
};