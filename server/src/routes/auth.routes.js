import { Router } from "express";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";

import {
  register,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth/auth.controller.js";

import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
  emailSchema,
  verifyEmailSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  login
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout authenticated user
 * @access  Private
 */
router.post(
  "/logout",
  authenticate,
  logout
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  "/refresh",
  authRateLimiter,
  refreshAccessToken
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  "/forgot-password",
  authRateLimiter,
  validate(emailSchema),
  forgotPassword
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset user password
 * @access  Public
 */
router.post(
  "/reset-password",
  authRateLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

/**
 * @route   POST /api/v1/auth/send-verification
 * @desc    Send email verification link
 * @access  Public
 */
router.post(
  "/send-verification",
  authRateLimiter,
  sendVerificationEmail
);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify user email
 * @access  Public
 */
router.post(
  "/verify-email",
  authRateLimiter,
  validate(verifyEmailSchema),
  verifyEmail
);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend email verification link
 * @access  Public
 */
router.post(
  "/resend-verification",
  authRateLimiter,
  validate(emailSchema),
  resendVerificationEmail
);

export default router;