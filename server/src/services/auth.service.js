import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

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

  let decoded;

  // Verify refresh token
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

  // Find user using token subject/id
  const user = await User.findById(decoded.id).select(
    "+refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  // Check account status
  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated."
    );
  }

  // Make sure the supplied token is the one stored for this user
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  // Generate new token pair
  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  // Rotate refresh token
  user.refreshToken = newRefreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
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

  // Store only hashed token in database
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

  // Password reset URL
  const resetUrl =
    `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Send reset email
  await sendEmail({
    to: user.email,
    subject: "Reset Your NoteNexus AI Password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>

        <p>Hello ${user.fullName},</p>

        <p>
          We received a request to reset your NoteNexus AI password.
        </p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          This password reset link expires in 15 minutes.
        </p>

        <p>
          If you did not request a password reset, you can safely
          ignore this email.
        </p>

        <p>
          Regards,<br />
          NoteNexus AI Team
        </p>
      </div>
    `,
  });

  return true;
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
/**
 * Send email verification
 */
async sendVerificationEmail(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified.");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires =
    Date.now() + 15 * 60 * 1000;

  await user.save({
    validateBeforeSave: false,
  });

  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify Your NoteNexus AI Account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to NoteNexus AI</h2>

        <p>Hello ${user.fullName},</p>

        <p>
          Please verify your email address to activate your
          NoteNexus AI account.
        </p>

        <p>
          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Verify Email
          </a>
        </p>

        <p>This verification link expires in 15 minutes.</p>

        <p>
          If you did not create this account, you can safely ignore
          this email.
        </p>

        <p>Regards,<br />NoteNexus AI Team</p>
      </div>
    `,
  });

  return {
    message: "Verification email sent successfully.",
  };
}

/**
 * Verify user email
 */
async verifyEmail(verificationToken) {
  if (!verificationToken) {
    throw new ApiError(400, "Verification token is required.");
  }

  // Hash token received from client
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // Find user with valid verification token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: {
      $gt: Date.now(),
    },
  }).select(
    "+emailVerificationToken +emailVerificationExpires"
  );

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired verification token."
    );
  }

  // Mark email as verified
  user.isVerified = true;

  // Remove verification token
  user.emailVerificationToken = "";
  user.emailVerificationExpires = null;

  await user.save();

  return true;
}

/**
 * Resend email verification
 */
async resendVerificationEmail(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified.");
  }

  return await this.sendVerificationEmail(user._id);
}

}

export default new AuthService();