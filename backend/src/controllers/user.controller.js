import { asyncHandler } from '../handlers/async.handler.js';
import userService from '../services/user.service.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Create a new user (Admin only)
 */
const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, 'User created successfully', user));
});

/**
 * Update an existing user (Admin only)
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, 'User updated successfully', user));
});

/**
 * Get user by ID (Admin only)
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, 'User retrieved successfully', user));
});

/**
 * Delete user (Admin only)
 */
const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, 'User deleted (suspended) successfully'));
});

export default {
  createUser,
  updateUser,
  getUser,
  deleteUser,
};
