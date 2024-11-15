const jwt = require("jsonwebtoken");
require("dotenv").config();
const authService = require("../services/auth.service.js");
const handleRequest = require("../helpers/handleRequest");

const SECRET_KEY = process.env.SECRET_KEY;
const JWT_EXPIRATION = "1h";

const createAccount = async (req, res, next) => {
  await handleRequest(
    authService.signUp,
    [req.body],
    res,
    next,
    "Account created successfully.",
    "Account creation failed."
  );
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required.",
    });
  }

  await handleRequest(
    async (email, password) => {
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
    [email, password],
    res,
    next,
    "Login successful.",
    "Invalid credentials."
  );
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required.",
    });
  }

  await handleRequest(
    authService.forgotPassword,
    [email],
    res,
    next,
    "Password reset instructions sent successfully.",
    "Failed to send password reset instructions."
  );
};

const resetPassword = async (req, res, next) => {
  const { password, password2, email } = req.body;

  // Input validation
  if (!password || !password2 || !email) {
    return res.status(400).json({
      status: "error",
      message: "Password, confirmation, and email are required.",
    });
  }

  if (password !== password2) {
    return res.status(400).json({
      status: "error",
      message: "Passwords do not match.",
    });
  }

  if (password.trim().length < 6) {
    return res.status(400).json({
      status: "error",
      message: "Password must be at least 6 characters long.",
    });
  }

  // Call the resetPassword service
  try {
    const result = await authService.resetPassword(password, password2, email);
    if (!result) {
      return res.status(400).json({
        status: "error",
        message: "Password reset failed.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
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
