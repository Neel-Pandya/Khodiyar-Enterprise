import adminOrderService from '../services/adminOrder.service.js';
import logger from '../utils/logger.js';

const adminOrderController = {
  /**
   * Get all orders (paginated, filterable)
   * GET /api/admin/orders
   */
  getAllOrders: async (req, res) => {
    const { page, limit, status, payment_status, payment_type, sort_by, sort_order } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (payment_status) filters.payment_status = payment_status;
    if (payment_type) filters.payment_type = payment_type;

    const result = await adminOrderService.getAllOrders(
      page,
      limit,
      filters,
      sort_by,
      sort_order
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  },

  /**
   * Get single order by ID
   * GET /api/admin/orders/:orderId
   */
  getOrderById: async (req, res) => {
    const { orderId } = req.params;
    const result = await adminOrderService.getOrderById(orderId);
    res.status(200).json({
      success: true,
      data: result,
    });
  },

  /**
   * Update order status
   * PATCH /api/admin/orders/:orderId/status
   */
  updateOrderStatus: async (req, res) => {
    const { orderId } = req.params;
    const { status, payment_status } = req.body;
    const adminId = req.user.id;

    const updates = {};
    if (status) updates.status = status;
    if (payment_status) updates.payment_status = payment_status;

    const result = await adminOrderService.updateOrderStatus(orderId, updates, adminId);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: result,
    });
  },
};

export default adminOrderController;
