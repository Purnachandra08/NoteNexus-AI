import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

const authenticate = async (req, res, next) => {
  try {
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

    // Verify access token
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );

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

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid access token."));
    }

    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token has expired."));
    }

    next(error);
  }
};

export default authenticate;