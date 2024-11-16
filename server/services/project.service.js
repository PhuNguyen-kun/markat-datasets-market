const {
    getAllProjectsDb,
    getProjectDetailDb,
} = require("../db/project.db");
const { ErrorHandler } = require("../helpers/error");

class ProjectService {
    getAllProjects = async ({ page }) => {
        const limit = 20;
        const offset = (page - 1) * limit;
        try {
            return await getAllProjectsDb({ limit, offset });
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
    getProjectDetail = async ({ id_version }) => {
        try {
            return await getProjectDetailDb(id_version);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
}
module.exports = new ProjectService();