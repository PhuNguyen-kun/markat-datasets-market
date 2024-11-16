const projectService = require("../services/project.service");
const { handleRequest } = require("../helpers/error");

const getAllProjects = async (req, res, next) => {
  await handleRequest(
    projectService.getAllProjects,
    [req.query],
    res,
    next,
    ["page"],
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
    ["id_version"],
    "Project detail retrieved successfully",
    "Project detail not found"
  );
};

module.exports = {
  getAllProjects,
  getProjectDetail,
};
