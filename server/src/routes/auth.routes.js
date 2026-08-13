import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/auth/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout authenticated user
 * @access  Private
 */
router.post("/logout", authenticate, logout);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post("/refresh", refreshAccessToken);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset user password
 * @access  Public
 */
router.post("/reset-password", resetPassword);

/**
 * @route   POST /api/v1/auth/send-verification
 * @desc    Send email verification link
 * @access  Public
 */
router.post("/send-verification", sendVerificationEmail);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify user email
 * @access  Public
 */
router.post("/verify-email", verifyEmail);

export default router;