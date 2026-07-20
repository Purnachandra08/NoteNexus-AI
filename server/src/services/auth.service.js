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
}

export default new AuthService();