const jwt = require("jsonwebtoken");
require("dotenv").config();
const authService = require("../services/auth.service.js");
const { handleRequest } = require("../helpers/error");

const SECRET_KEY = process.env.SECRET_KEY;
const JWT_EXPIRATION = "1h";

const createAccount = async (req, res, next) => {
  await handleRequest(
    authService.signUp,
    [req.body],
    res,
    next,
    ["email", "password", "full_name"],
    "Account created successfully.",
    "Account creation failed."
  );
};

const loginUser = async (req, res, next) => {
  await handleRequest(
    async ({ email, password }) => {
      const { user } = await authService.login(email, password);
      const access_token = jwt.sign(
        {
          id_user: user.id_user,
          full_name: user.full_name,
          email: user.email,
        },
        SECRET_KEY,
        { expiresIn: JWT_EXPIRATION }
      );
      return {
        user: {
          id_user: user.id_user,
          full_name: user.full_name,
          email: user.email,
        },
        access_token,
      };
    },
    [req.body],
    res,
    next,
    ["email", "password"],
    "Login successful.",
    "Invalid credentials."
  );
};

const forgotPassword = async (req, res, next) => {
  await handleRequest(
    authService.forgotPassword,
    [req.body],
    res,
    next,
    ["email"],
    "Password reset instructions sent successfully.",
    "Failed to send password reset instructions."
  );
};

const resetPassword = async (req, res, next) => {
  await handleRequest(
    authService.resetPassword,
    [req.body],
    res,
    next,
    ["password", "password2", "email"],
    "Password reset successfully.",
    "Password reset failed."
  );
};

const logoutUser = async (req, res, next) => {
  await handleRequest(
    authService.logout,
    [],
    res,
    next,
    "Logout successful.",
    "Logout failed."
  );
};

module.exports = {
  createAccount,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
};
