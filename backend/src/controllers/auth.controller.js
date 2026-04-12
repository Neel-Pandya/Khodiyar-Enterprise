import { asyncHandler } from '../handlers/async.handler.js';
import prisma from '../db/prisma.js';
import authService from '../services/auth.service.js';
import verificationService from '../services/verification.service.js';
import passwordResetService from '../services/password-reset.service.js';
import imageService from '../services/image.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.login({
    email,
    password,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res
    .status(200)
    .json(new ApiResponse(200, 'Login successful', { user, accessToken }));
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await authService.register({ name, email, password });

  res.status(201).json(
    new ApiResponse(
      201,
      'User registered successfully. Please check your email for verification.',
      {
        user,
      }
    )
  );
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { token, otp } = req.body;

  if (!token || !otp) {
    throw new ApiError(400, 'Token and OTP are required');
  }

  const result = await verificationService.verifyEmailOTP(token, otp);
  res.status(200).json(new ApiResponse(200, result.message));
});

const resendOTP = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, 'Token is required');
  }

  const result = await verificationService.resendVerificationOTP(token);
  res.status(200).json(new ApiResponse(200, result.message));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await passwordResetService.initiatePasswordReset(email);
  res.status(200).json(new ApiResponse(200, result.message));
});

const verifyResetOTP = asyncHandler(async (req, res) => {
  const { token, otp } = req.body;
  const result = await passwordResetService.verifyResetOTP(token, otp);
  res.status(200).json(new ApiResponse(200, result.message));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const result = await passwordResetService.executePasswordReset(
    token,
    password
  );
  res.status(200).json(new ApiResponse(200, result.message));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // User data is attached by authenticate middleware (contains id, email, role from JWT)
  const userId = req.user.id;

  // Fetch complete user data from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'User data retrieved successfully', { user }));
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updateData = { ...req.body };

  // Handle avatar upload if file is present
  if (req.file) {
    const uploadResult = await imageService.uploadFile(
      req.file.path,
      'avatars'
    );
    updateData.avatar = uploadResult.secure_url;
  }

  // Only allow updating name and avatar
  const allowedUpdates = {};
  if (updateData.name !== undefined) allowedUpdates.name = updateData.name;
  if (updateData.avatar !== undefined)
    allowedUpdates.avatar = updateData.avatar;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: allowedUpdates,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  res.status(200).json(
    new ApiResponse(200, 'Profile updated successfully', {
      user: updatedUser,
    })
  );
});

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  const result = await authService.changePassword(
    userId,
    currentPassword,
    newPassword
  );

  res.status(200).json(new ApiResponse(200, result.message));
});

const checkVerificationStatus = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const status = await verificationService.getVerificationStatus(email);

  res.status(200).json(
    new ApiResponse(200, 'Verification status retrieved', status)
  );
});

const initiateLoginVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, status: true },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.status === 'active') {
    throw new ApiError(400, 'User email is already verified');
  }

  const verification = await prisma.verification.findUnique({
    where: { user_id: user.id },
  });

  // Check if verification link exists and is not expired
  if (verification && new Date() <= new Date(verification.token_expires_at)) {
    throw new ApiError(
      429,
      'Verification link already sent and is still valid'
    );
  }

  // Create/resend verification email
  await verificationService.createVerification(user);

  res.status(200).json(
    new ApiResponse(200, 'Verification email sent successfully')
  );
});

export default {
  login,
  register,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getCurrentUser,
  updateProfile,
  changePassword,
  checkVerificationStatus,
  initiateLoginVerification,
};
