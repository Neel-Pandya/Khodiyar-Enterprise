import { Router } from 'express';
import orderController from '../controllers/order.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createOrderSchema,
  orderIdParamSchema,
  getOrdersQuerySchema,
} from '../validations/order.validation.js';

const router = Router();

// All order routes require authentication
router.use(authenticate);

/**
 * @route POST /api/orders
 * @desc Create order from cart
 * @access Private
 */
router.post('/', validate(createOrderSchema), orderController.createOrder);

/**
 * @route GET /api/orders
 * @desc Get user's orders (paginated, sortable)
 * @access Private
 */
router.get('/', validate(getOrdersQuerySchema, 'query'), orderController.getOrders);

/**
 * @route GET /api/orders/:orderId
 * @desc Get single order details
 * @access Private
 */
router.get('/:orderId', validate(orderIdParamSchema, 'params'), orderController.getOrderById);

/**
 * @route PATCH /api/orders/:orderId/cancel
 * @desc Cancel order (only pending orders)
 * @access Private
 */
router.patch('/:orderId/cancel', validate(orderIdParamSchema, 'params'), orderController.cancelOrder);

export default router;
