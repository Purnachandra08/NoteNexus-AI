import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const { fullName, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "User already exists with this email.");
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      role,
    });

    // Remove sensitive fields
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Failed to create user.");
    }

    return createdUser;
  }

  /**
   * Login user
   */
  async login(loginData) {
    const { email, password } = loginData;

    // Find user including password
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    // Check if account is active
    if (!user.isActive) {
      throw new ApiError(403, "Your account has been deactivated.");
    }

    // Check email verification
    // if (!user.isVerified) {
    //   throw new ApiError(
    //     403,
    //     "Please verify your email before logging in."
    //   );
    // }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password.");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token
    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    // Remove sensitive fields
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return {
      user: loggedInUser,
      accessToken,
      refreshToken,
    };
  }

  /**
 * Logout user
 */
async logout(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.refreshToken = "";

  await user.save({
    validateBeforeSave: false,
  });

  return true;
}

/**
 * Refresh access token
 */
async refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required.");
  }

  const user = await User.findOne({ refreshToken }).select(
    "+refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated.");
  }

  let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token has expired.");
    }

    throw new ApiError(401, "Invalid refresh token.");
  }

  if (decoded.id !== user._id.toString()) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  const accessToken = user.generateAccessToken();

  return accessToken;
}
/**
 * Forgot password
 */
async forgotPassword(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      404,
      "No account found with this email."
    );
  }

  // Generate secure random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Store hashed token in database
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;

  // Token valid for 15 minutes
  user.resetPasswordExpires =
    Date.now() + 15 * 60 * 1000;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    resetToken,
  };
}

/**
 * Reset password
 */
async resetPassword(resetToken, newPassword) {
  if (!resetToken) {
    throw new ApiError(400, "Reset token is required.");
  }

  if (!newPassword) {
    throw new ApiError(400, "New password is required.");
  }

  // Hash token received from client
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find user with valid reset token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  }).select("+resetPasswordToken");

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired password reset token."
    );
  }

  // Update password
  user.password = newPassword;

  // Invalidate reset token
  user.resetPasswordToken = "";
  user.resetPasswordExpires = null;

  // Invalidate existing refresh token
  user.refreshToken = "";

  await user.save();

  return true;
}
}

export default new AuthService();