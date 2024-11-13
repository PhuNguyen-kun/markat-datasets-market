const projectService = require("../services/project.service.js");

const getAllProjects = async (req, res) => {
    const { page = 1 } = req.query;
    const projects = await projectService.getAllProjects(page);
    res.status(200).json(projects);
};
const getProjectDetail = async (req, res) => {
    const { id_version } = req.query;
   // console.log(id_part);

    const projectDetail = await projectService.getProjectDetail(id_version);
    res.status(200).json(projectDetail);
}
module.exports = {
    getAllProjects,
    getProjectDetail,
};