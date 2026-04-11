import { Router } from 'express';
import authenticate from '../middlewares/jwt.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', dashboardController.getStats);
router.get('/recent-orders', dashboardController.getRecentOrders);

export default router;
