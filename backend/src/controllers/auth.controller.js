import { asyncHandler } from "../handlers/async.handler.js";

const login = asyncHandler(async (req, res) => {
    // Implement login logic here
    res.status(200).json({ message: "Login successful" });
});

const register = asyncHandler(async (req, res) => {
    // Implement registration logic here
    res.status(201).json({ message: "Registration successful" });
});

export default {
    login,
    register,
};