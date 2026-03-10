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
    // Implement registration logic here

    const {name, email, password} = req.body;

    const user = await authService.register({name, email, password});

    res.status(201).json(new ApiResponse(200, "User registered successfully", user));
});

export default {
    login,
    register,
};