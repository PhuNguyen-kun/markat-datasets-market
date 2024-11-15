const projectService = require("../services/project.service");
const handleRequest = require("../helpers/handleRequest");

const getAllProjects = async (req, res, next) => {
  const { page = 1 } = req.query;
  await handleRequest(
    projectService.getAllProjects,
    [page],
    res,
    next,
    "Projects retrieved successfully",
    "Projects not found"
  );
};

const getProjectDetail = async (req, res, next) => {
  const { id_version } = req.query;
  await handleRequest(
    projectService.getProjectDetail,
    [id_version],
    res,
    next,
    "Project detail retrieved successfully",
    "Project detail not found"
  );
};

module.exports = {
  getAllProjects,
  getProjectDetail,
};
