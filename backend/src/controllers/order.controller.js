import orderService from '../services/order.service.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const orderController = {
  /**
   * Create order from cart
   * POST /api/orders
   */
  createOrder: async (req, res) => {
    const userId = req.user.id;
    const userEmail = req.user.email; // From auth token, NOT body
    const { full_name, phone, address, city, state, pincode, payment_type } = req.body;

    try {
      const result = await orderService.createOrder(
        userId,
        userEmail,
        { full_name, phone, address, city, state, pincode, payment_type }
      );

      // Send order confirmation email (best effort, don't fail if email fails)
      try {
        await orderService.sendOrderConfirmation(result.order, result.order.order_items);
      } catch (emailError) {
        logger.error('Failed to send order confirmation email', { error: emailError.message });
      }

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: result
      });
    } catch (error) {
      // Re-throw to be handled by error middleware (includes 409 for stock issues)
      throw error;
    }
  },

  /**
   * Get user's orders (paginated, sortable)
   * GET /api/orders
   */
  getOrders: async (req, res) => {
    const { page, limit, status, sort_by, sort_order } = req.query;
    const result = await orderService.getUserOrders(
      req.user.id,
      page,
      limit,
      status,
      sort_by,
      sort_order
    );
    res.status(200).json({ success: true, data: result });
  },

  /**
   * Get single order by ID
   * GET /api/orders/:orderId
   */
  getOrderById: async (req, res) => {
    const { orderId } = req.params;
    const result = await orderService.getOrderById(req.user.id, orderId);
    res.status(200).json({ success: true, data: result });
  },

  /**
   * Cancel order (only pending orders)
   * PATCH /api/orders/:orderId/cancel
   */
  cancelOrder: async (req, res) => {
    const { orderId } = req.params;
    const result = await orderService.cancelOrder(req.user.id, orderId);
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: result
    });
  }
};

export default orderController;
