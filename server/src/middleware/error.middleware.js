import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert unknown errors into ApiError
  if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }

  res.status(error.statusCode).json({
    success: error.success,
    statusCode: error.statusCode,
    message: error.message,
  });
};

export default errorHandler;