import { Router } from 'express';
import paymentController from '../controllers/payment.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { verifyPaymentSchema } from '../validations/payment.validation.js';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

/**
 * @route POST /api/payments/create-order
 * @desc Create Razorpay order from cart
 * @access Private
 */
router.post('/create-order', paymentController.createOrder);

/**
 * @route POST /api/payments/verify-payment
 * @desc Verify Razorpay payment and create order
 * @access Private
 */
router.post(
  '/verify-payment',
  validate(verifyPaymentSchema),
  paymentController.verifyPayment
);

export default router;
