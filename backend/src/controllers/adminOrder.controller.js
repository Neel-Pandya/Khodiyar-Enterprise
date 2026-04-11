import { asyncHandler } from '../handlers/async.handler.js';
import adminOrderService from '../services/adminOrder.service.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Get all orders (paginated, filterable)
 * GET /api/admin/orders
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    status,
    payment_status,
    payment_type,
    sort_by,
    sort_order,
  } = req.query;

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

  return res
    .status(200)
    .json(new ApiResponse(200, 'Orders retrieved successfully', result));
});

/**
 * Get single order by ID
 * GET /api/admin/orders/:orderId
 */
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const result = await adminOrderService.getOrderById(orderId);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Order retrieved successfully', result));
});

/**
 * Update order status
 * PATCH /api/admin/orders/:orderId/status
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, payment_status } = req.body;
  const adminId = req.user.id;

  const updates = {};
  if (status) updates.status = status;
  if (payment_status) updates.payment_status = payment_status;

  const result = await adminOrderService.updateOrderStatus(
    orderId,
    updates,
    adminId
  );

  return res
    .status(200)
    .json(new ApiResponse(200, 'Order status updated successfully', result));
});

export default { getAllOrders, getOrderById, updateOrderStatus };
