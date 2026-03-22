import { asyncHandler } from '../handlers/async.handler.js';
import authService from '../services/auth.service.js';
import verificationService from '../services/verification.service.js';
import passwordResetService from '../services/password-reset.service.js';
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

export default {
  login,
  register,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
