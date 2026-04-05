import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import favoriteRoutes from './favorite.routes.js';
import cartRoutes from './cart.routes.js';

const router = Router();

// ── Import Route Modules ───────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/cart', cartRoutes);

export default router;
