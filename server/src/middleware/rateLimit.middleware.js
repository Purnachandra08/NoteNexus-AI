import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 20, // Maximum 20 requests per IP

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication requests. Please try again later.",
  },
});