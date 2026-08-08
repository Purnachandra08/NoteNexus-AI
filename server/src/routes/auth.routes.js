import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
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

export default router;