const userService = require("../services/users.service");
const { handleRequest } = require("../helpers/error");

const getUserProfile = async (req, res, next) => {
  await handleRequest(
    userService.getUserById,
    [req.query],
    res,
    next,
    [id_user],
    "User profile retrieved successfully",
    "User profile not found"
  );
};

const getUserReliability = async (req, res, next) => {
  await handleRequest(
    userService.getUserReliabilitybyId,
    [req.query],
    res,
    next,
    [["id_user"]],
    "User reliability retrieved successfully",
    "User reliability not found"
  );
};

const getUserKat = async (req, res, next) => {
  await handleRequest(
    userService.getUserKatbyId,
    [req.query],
    res,
    next,
    [["id_user"]],
    "User Kat retrieved successfully",
    "User Kat not found"
  );
};

module.exports = {
  getUserProfile,
  getUserReliability,
  getUserKat,
};
