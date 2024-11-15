const { logger } = require("../utils/logger");

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.status = "error";
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;

  logger.error({
    message: err.message || "Internal Server Error",
    stack: err.stack,
  });

  const response = {
    status: "error",
    statusCode: statusCode || 500,
    message: statusCode === 500 ? "An internal error occurred" : message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(response.statusCode).json(response);
};

const handleRequest = async (serviceFunction, params, res, next, successMessage = "Request successful", errorMessage = "Resource not found") => {
  try {
    const result = await serviceFunction(...params);
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({
        status: "error",
        message: errorMessage,
      });
    }
    return res.status(200).json({
      status: "success",
      message: successMessage,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  }
};

module.exports = {
  ErrorHandler,
  handleError,
};
