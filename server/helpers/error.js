const { logger } = require("../utils/logger");

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const handleError = (err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    status: "error",
    message: message || "Internal Server Error",
    // Không trả về `stack`
  });
};

const handleRequest = async (
  serviceFunction,
  params,
  res,
  next,
  requiredFields = [],
  successMessage = "Request successful",
  errorMessage = "Resource not found"
) => {
  try {
    // Validate inputs nếu có requiredFields
    if (requiredFields.length > 0) {
      for (const field of requiredFields) {
         console.log(params[0][field]);
        if (!params[0][field]) {
          return res.status(400).json({
            status: "error",
            message: `${field} is required.`,
          });
        }
      }
    }

    // Gọi service function
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
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal Server Error",
      // Loại bỏ stack khỏi phản hồi
    });
  }
};

module.exports = {
  ErrorHandler,
  handleError,
  handleRequest
};
