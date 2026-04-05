import { Router } from 'express';
import authenticate from '../middlewares/jwt.middleware.js';
import adminOrderController from '../controllers/adminOrder.controller.js';
import validate from '../middlewares/validate.middleware.js';
import {
  updateOrderStatusSchema,
  orderIdParamSchema,
  getAdminOrdersQuerySchema,
} from '../validations/adminOrder.validation.js';

const router = Router();

// All admin order routes require authentication
router.use(authenticate);

/**
 * @route GET /api/admin/orders
 * @desc Get all orders (paginated, filterable)
 * @access Admin
 */
router.get(
  '/',
  validate(getAdminOrdersQuerySchema, 'query'),
  adminOrderController.getAllOrders
);

/**
 * @route GET /api/admin/orders/:orderId
 * @desc Get single order details
 * @access Admin
 */
router.get(
  '/:orderId',
  validate(orderIdParamSchema, 'params'),
  adminOrderController.getOrderById
);

/**
 * @route PATCH /api/admin/orders/:orderId/status
 * @desc Update order status and/or payment status
 * @access Admin
 */
router.patch(
  '/:orderId/status',
  validate(orderIdParamSchema, 'params'),
  validate(updateOrderStatusSchema),
  adminOrderController.updateOrderStatus
);

export default router;
