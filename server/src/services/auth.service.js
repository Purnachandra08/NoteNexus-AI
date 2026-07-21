import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

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
}

export default new AuthService();