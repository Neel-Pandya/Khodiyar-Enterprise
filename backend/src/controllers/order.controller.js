import { asyncHandler } from '../handlers/async.handler.js';
import orderService from '../services/order.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import logger from '../utils/logger.js';

/**
 * Create order from cart
 * POST /api/orders
 */
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email; // From auth token, NOT body
  const { full_name, phone, address, city, state, pincode, payment_type } =
    req.body;

  const result = await orderService.createOrder(userId, userEmail, {
    full_name,
    phone,
    address,
    city,
    state,
    pincode,
    payment_type,
  });

  // Send order confirmation email (best effort, don't fail if email fails)
  try {
    await orderService.sendOrderConfirmation(
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
    .json(new ApiResponse(201, 'Order placed successfully', result));
});

/**
 * Get user's orders (paginated, sortable)
 * GET /api/orders
 */
const getOrders = asyncHandler(async (req, res) => {
  const { page, limit, status, sort_by, sort_order } = req.query;
  const result = await orderService.getUserOrders(
    req.user.id,
    page,
    limit,
    status,
    sort_by,
    sort_order
  );
  return res
    .status(200)
    .json(new ApiResponse(200, 'Orders retrieved successfully', result));
});

/**
 * Get single order by ID
 * GET /api/orders/:orderId
 */
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderService.getOrderById(req.user.id, orderId);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Order retrieved successfully', result));
});

/**
 * Cancel order (only pending orders)
 * PATCH /api/orders/:orderId/cancel
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderService.cancelOrder(req.user.id, orderId);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Order cancelled successfully', result));
});

export default { createOrder, getOrders, getOrderById, cancelOrder };
