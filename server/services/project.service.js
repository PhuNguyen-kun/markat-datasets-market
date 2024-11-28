const { getDatasetAvatar } = require("../db/datasets.db");
const {
    getProjectsByTopicDb,
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
    async getProjectsByTopic ({ quantity, topic }) {
        try {
            const projects = await getProjectsByTopicDb({ topic });
            await Promise.all(projects.map(async (project) => {
                if (project.avatar && project.id_dataset) {
                    project.avatar = await getDatasetAvatar(project.id_dataset);
                }
            }));
            const shuffledProjects = projects.sort(() => 0.5 - Math.random());
            const randomProjects = shuffledProjects.slice(0, quantity);
            return { projects : randomProjects}
        } catch (error) {
            throw new ErrorHandler(error.statusCode || 500, error.message || "Failed to fetch projects.");
        }
    };
    async getProjectDetail ({ id_version }) {
        try {
            return await getProjectDetailDb(id_version);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };
}
module.exports = new ProjectService();