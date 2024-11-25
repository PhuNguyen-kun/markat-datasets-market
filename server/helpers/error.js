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
  });
};

const handleRequest = async (
  serviceFunction,
  params,
  res,
  next,
  requiredFields = [[]],
  successMessage = "Request successful",
  errorMessage = "Resource not found"
) => {
  try {
    if (requiredFields.length > 0) {
      for (let i = 0; i < params.length; i++) {
        const currentRequiredFields = requiredFields[i] || [];
        for (const field of currentRequiredFields) {
          if (!params[i] || !params[i][field]) {
            return res.status(400).json({
              status: "error",
              message: `${field} is required in parameter at index ${i}.`,
            });
          }
        }
      }
    }
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
    });
  }
};

module.exports = {
  ErrorHandler,
  handleError,
  handleRequest
};
