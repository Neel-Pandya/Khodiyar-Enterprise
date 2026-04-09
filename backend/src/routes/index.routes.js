import { Router } from 'express';
import authenticate from '../middlewares/jwt.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';
import adminOrderRoutes from './adminOrder.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

// ── Import Route Modules ───────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);

// Admin routes - protected with authenticate + authorize middleware
router.use('/admin/orders', authenticate, authorize('admin'), adminOrderRoutes);
router.use('/admin/dashboard', authenticate, authorize('admin'), dashboardRoutes);

export default router;
