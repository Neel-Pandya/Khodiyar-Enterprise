import { asyncHandler } from '../handlers/async.handler.js';
import profileService from '../services/profile.service.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Update user profile (name, phone, avatar)
 * Works for both admin and regular users - updates the authenticated user's own profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Extracted from JWT token
  const updateData = req.body;
  const file = req.file;

  const updatedUser = await profileService.updateProfile(
    userId,
    updateData,
    file
  );

  return res
    .status(200)
    .json(new ApiResponse(200, 'Profile updated successfully', updatedUser));
});

/**
 * Change user password
 * Requires current password, new password, and confirm password
 * After successful password change, clears refresh token cookie to revoke access
 */
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Extracted from JWT token
  const { currentPassword, newPassword } = req.body;

  await profileService.changePassword(userId, currentPassword, newPassword);

  // Clear refresh token cookie to revoke all sessions
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.status(200).json(
    new ApiResponse(200, 'Password changed successfully', {
      message:
        'Your password has been changed. Please log in again with your new password.',
    })
  );
});

export default {
  updateProfile,
  changePassword,
};
