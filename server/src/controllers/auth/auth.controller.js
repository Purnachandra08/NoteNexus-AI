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

export { register, login };