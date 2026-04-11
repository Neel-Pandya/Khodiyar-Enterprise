import crypto from 'crypto';
import prisma from '../db/prisma.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import razorpay from '../configs/razorpay.config.js';
import emailService from './email.service.js';

class PaymentService {
  /**
   * Create a Razorpay order (payment intent) from user's cart
   * Amount is in paisa (INR * 100)
   */
  async createRazorpayOrder(userId) {
    // 1. Fetch cart items with product details
    const cartItems = await prisma.cart.findMany({
      where: { user_id: userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new ApiError(400, 'Cart is empty');
    }

    // 2. Validate stock availability
    for (const item of cartItems) {
      if (item.product.stock_quantity < item.quantity) {
        throw new ApiError(
          409,
          `Insufficient stock for ${item.product.name}. Available: ${item.product.stock_quantity}, Requested: ${item.quantity}`
        );
      }
      if (!item.product.is_active || item.product.deleted_at) {
        throw new ApiError(
          409,
          `Product ${item.product.name} is no longer available`
        );
      }
    }

    // 3. Calculate total amount in paisa (multiply by 100)
    const totalAmountInr = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
    const amountInPaisa = Math.round(totalAmountInr * 100);

    // 4. Create Razorpay order
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaisa,
        currency: 'INR',
        receipt: `receipt_${Date.now()}_${userId.slice(0, 8)}`,
        notes: {
          user_id: userId,
          cart_item_count: cartItems.length.toString(),
        },
      });
    } catch (razorpayError) {
      const statusCode = razorpayError.statusCode;
      logger.error('Razorpay order creation failed', {
        error: razorpayError.message,
        statusCode,
        code: razorpayError.code,
        description: razorpayError.description,
        fullError: JSON.stringify(razorpayError),
        userId,
        amount: amountInPaisa,
      });

      if (statusCode === 401) {
        throw new ApiError(
          500,
          'Payment configuration error. Please contact support.'
        );
      }
      throw new ApiError(
        502,
        'Payment service temporarily unavailable. Please try again.'
      );
    }

    logger.info('Razorpay order created', {
      razorpayOrderId: razorpayOrder.id,
      userId,
      amount: amountInPaisa,
    });

    return {
      order_id: razorpayOrder.id,
      amount: amountInPaisa,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    };
  }

  /**
   * Verify Razorpay payment signature
   * Signature = HMAC SHA256 of (order_id + "|" + payment_id) with API secret
   */
  verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, signature) {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === signature;

    if (!isValid) {
      logger.error('Payment signature verification failed', {
        razorpayOrderId,
        razorpayPaymentId,
      });
    }

    return isValid;
  }

  /**
   * Create actual Order record after successful payment verification
   * Uses transaction for atomic operations
   */
  async createOrderAfterPayment(
    userId,
    userEmail,
    orderData,
    razorpayPaymentId,
    razorpayOrderId
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch cart items with product details
      const cartItems = await tx.cart.findMany({
        where: { user_id: userId },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        throw new ApiError(400, 'Cart is empty');
      }

      // 2. Re-validate stock (safety check)
      for (const item of cartItems) {
        if (item.product.stock_quantity < item.quantity) {
          throw new ApiError(
            409,
            `Insufficient stock for ${item.product.name}. Available: ${item.product.stock_quantity}, Requested: ${item.quantity}`
          );
        }
      }

      // 3. Calculate total
      const totalAmount = cartItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);

      // 4. Create order record with completed payment status
      const order = await tx.order.create({
        data: {
          user_id: userId,
          total_amount: totalAmount,
          status: 'pending',
          payment_type: 'online',
          payment_status: 'completed',
          full_name: orderData.full_name,
          email: userEmail,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          pincode: orderData.pincode,
        },
      });

      // 5. Create order items with snapshot pricing
      const orderItems = await Promise.all(
        cartItems.map((item) =>
          tx.orderItem.create({
            data: {
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.product.price,
            },
          })
        )
      );

      // 6. Update product stock
      await Promise.all(
        cartItems.map((item) =>
          tx.product.update({
            where: { id: item.product_id },
            data: { stock_quantity: { decrement: item.quantity } },
          })
        )
      );

      // 7. Clear cart
      await tx.cart.deleteMany({ where: { user_id: userId } });

      logger.info('Order created after successful payment', {
        orderId: order.id,
        userId,
        razorpayPaymentId,
        razorpayOrderId,
        totalAmount,
      });

      return {
        order: {
          ...order,
          order_items: orderItems,
        },
      };
    });
  }

  /**
   * Send order confirmation email after successful order creation
   */
  async sendOrderConfirmation(order, orderItems) {
    try {
      // Fetch product names for order items
      const productIds = orderItems.map((item) => item.product_id);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
      });

      // Attach product names to order items
      const orderItemsWithProduct = orderItems.map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.product_id),
      }));

      await emailService.sendOrderConfirmationEmail(
        order.email,
        order.full_name,
        order,
        orderItemsWithProduct
      );
    } catch (emailError) {
      logger.error('Failed to send order confirmation email', {
        error: emailError.message,
      });
    }
  }
}

export default new PaymentService();
