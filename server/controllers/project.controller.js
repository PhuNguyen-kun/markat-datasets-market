const projectService = require("../services/project.service.js");

const getAllProjects = async (req, res) => {
    const { page = 1 } = req.query;
    const projects = await projectService.getAllProjects(page);
    res.status(200).json(projects);
};

module.exports = {
    getAllProjects,
};