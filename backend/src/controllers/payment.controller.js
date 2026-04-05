import paymentService from '../services/payment.service.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const paymentController = {
  /**
   * Create Razorpay order from cart
   * POST /api/payments/create-order
   */
  createOrder: async (req, res) => {
    const userId = req.user.id;

    try {
      const result = await paymentService.createRazorpayOrder(userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify payment and create order
   * POST /api/payments/verify-payment
   */
  verifyPayment: async (req, res) => {
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
      pincode
    } = req.body;

    try {
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
        await paymentService.sendOrderConfirmation(result.order, result.order.order_items);
      } catch (emailError) {
        logger.error('Failed to send order confirmation email', { error: emailError.message });
      }

      res.status(201).json({
        success: true,
        message: 'Payment successful and order placed',
        data: result
      });
    } catch (error) {
      throw error;
    }
  }
};

export default paymentController;
