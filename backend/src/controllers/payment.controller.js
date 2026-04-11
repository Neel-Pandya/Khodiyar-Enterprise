import { asyncHandler } from '../handlers/async.handler.js';
import paymentService from '../services/payment.service.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../utils/logger.js';

/**
 * Create Razorpay order from cart
 * POST /api/payments/create-order
 */
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await paymentService.createRazorpayOrder(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Razorpay order created successfully', result));
});

/**
 * Verify payment and create order
 * POST /api/payments/verify-payment
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    full_name,
    phone,
    address,
    city,
    state,
    pincode,
  } = req.body;

  // 1. Verify signature
  const isSignatureValid = paymentService.verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isSignatureValid) {
    throw new ApiError(400, 'Payment verification failed. Invalid signature.');
  }

  // 2. Create order after successful verification
  const orderData = { full_name, phone, address, city, state, pincode };
  const result = await paymentService.createOrderAfterPayment(
    userId,
    userEmail,
    orderData,
    razorpay_payment_id,
    razorpay_order_id
  );

  // 3. Send confirmation email (best effort)
  try {
    await paymentService.sendOrderConfirmation(
      result.order,
      result.order.order_items
    );
  } catch (emailError) {
    logger.error('Failed to send order confirmation email', {
      error: emailError.message,
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, 'Payment successful and order placed', result));
});

export default { createOrder, verifyPayment };
