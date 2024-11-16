const {
    getAllProjectsDb,
    getProjectDetailDb,
} = require("../db/project.db");
const { ErrorHandler } = require("../helpers/error");

class ProjectService {
    constructor(name) {
    this.name = name;
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (typeof this[key] === "function" && key !== "constructor") {
        this[key] = this[key].bind(this);
      }
    }
  }
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