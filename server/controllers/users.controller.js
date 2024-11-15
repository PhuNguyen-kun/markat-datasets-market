const userService = require("../services/users.service");
const handleRequest = require("../helpers/handleRequest");

const getUserProfile = async (req, res, next) => {
  const { id_user } = req.query;
  if (!id_user) {
    return res.status(400).json({ status: "error", message: "User ID is required" });
  }
  await handleRequest(
    userService.getUserById,
    [id_user],
    res,
    next,
    "User profile retrieved successfully",
    "User profile not found"
  );
};

const getUserReliability = async (req, res, next) => {
  const { id_user } = req.query;
  if (!id_user) {
    return res.status(400).json({ status: "error", message: "User ID is required" });
  }
  await handleRequest(
    userService.getUserReliabilitybyId,
    [id_user],
    res,
    next,
    "User reliability retrieved successfully",
    "User reliability not found"
  );
};

const getUserKat = async (req, res, next) => {
  const { id_user } = req.query;
  if (!id_user) {
    return res.status(400).json({ status: "error", message: "User ID is required" });
  }
  await handleRequest(
    userService.getUserKatbyId,
    [id_user],
    res,
    next,
    "User Kat retrieved successfully",
    "User Kat not found"
  );
};

module.exports = {
  getUserProfile,
  getUserReliability,
  getUserKat,
};
