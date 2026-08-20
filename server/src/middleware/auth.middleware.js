import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  // Get Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required.");
  }

  // Extract access token
  const accessToken = authHeader.split(" ")[1];

  if (!accessToken) {
    throw new ApiError(401, "Authentication required.");
  }

  let decoded;

  try {
    // Verify access token
    decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token has expired.");
    }

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid access token.");
    }

    throw error;
  }

  // Find authenticated user
  const user = await User.findById(decoded.id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  // Check whether account is active
  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated.");
  }

  // Attach authenticated user to request
  req.user = user;

  next();
});

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to access this resource.")
      );
    }

    next();
  };
};

export default authenticate;