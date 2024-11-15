const { ErrorHandler } = require("./error");
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

module.exports = handleRequest;