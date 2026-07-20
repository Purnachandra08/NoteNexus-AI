import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import authService from "../../services/auth.service.js";

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "User registered successfully.",
        user
      )
    );
});

export { register };