import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import authService from "../../services/auth.service.js";

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully.",
      user
    )
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } =
    await authService.login({
      email,
      password,
    });

  // Store Refresh Token in Secure HTTP-Only Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Login successful.",
      {
        user,
        accessToken,
      }
    )
  );
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Logout successful.",
      null
    )
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  const {
    accessToken,
    refreshToken: newRefreshToken,
  } = await authService.refreshAccessToken(refreshToken);

  // Replace old refresh token with rotated token
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Access token refreshed successfully.",
      {
        accessToken,
      }
    )
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password reset instructions have been sent to your email.",
      null
    )
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  await authService.resetPassword(
    resetToken,
    newPassword
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password reset successfully.",
      null
    )
  );
});

const sendVerificationEmail = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const result =
    await authService.sendVerificationEmail(userId);

  return res.status(200).json(
    new ApiResponse(
      200,
      result.message,
      null
    )
  );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.body;

  await authService.verifyEmail(verificationToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Email verified successfully.",
      null
    )
  );
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.resendVerificationEmail(email);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Verification email resent successfully.",
      result
    )
  );
});

export { register, login, logout, refreshAccessToken, forgotPassword, resetPassword, sendVerificationEmail, verifyEmail, resendVerificationEmail };