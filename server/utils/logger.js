const pino = require("pino");
const pretty = require("pino-pretty");
// Create a logging instance
const logger = pino(
  pretty({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    prettyPrint: process.env.NODE_ENV !== "production",
  })
);

module.exports.logger = logger;
