import { asyncHandler } from "../handlers/async.handler.js";
import authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";

const login = asyncHandler(async (req, res) => {
    // Implement login logic here
    const {email, password} = req.body;
    
    const {user, accessToken, refreshToken} = await authService.login({email, password});
    
    res.status(200).json(new ApiResponse(200, "Login successful", {user, accessToken, refreshToken}));
});

const register = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    const user = await authService.register({name, email, password});

    res.status(201).json(new ApiResponse(201, "User registered successfully. Please verify your email.", user));
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { token, otp } = req.body;
    
    if (!token || !otp) {
        throw new ApiError(400, "Token and OTP are required");
    }

    const result = await authService.verifyOTP(token, otp);
    res.status(200).json(new ApiResponse(200, result.message));
});

const resendOTP = asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        throw new ApiError(400, "Token is required");
    }

    const result = await authService.resendOTP(token);
    res.status(200).json(new ApiResponse(200, result.message));
});

export default {
    login,
    register,
    verifyOTP,
    resendOTP,
};