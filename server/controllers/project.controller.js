const projectService = require("../services/project.service");
const { handleRequest } = require("../helpers/error");

const getProjectsByTopic = async (req, res, next) => {
  await handleRequest(
    projectService.getProjectsByTopic,
    [req.query],
    res,
    next,
    [["topic"]],
    "Projects retrieved successfully",
    "Projects not found"
  );
};

const getProjectDetail = async (req, res, next) => {
  await handleRequest(
    projectService.getProjectDetail,
    [req.query],
    res,
    next,
    [["id_version"]],
    "Project detail retrieved successfully",
    "Project detail not found"
  );
};

module.exports = {
  getProjectsByTopic,
  getProjectDetail,
};
