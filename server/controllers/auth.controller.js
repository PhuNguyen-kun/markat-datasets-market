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

module.exports = {
    loginUser
};