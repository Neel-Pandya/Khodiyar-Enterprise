import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authenticate from '../middlewares/jwt.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createUserSchema,
  updateUserSchema,
} from '../validations/user.validation.js';
import { Roles } from '../configs/roles.js';
const router = Router();

// All routes here require authentication and admin role
router.use(authenticate);
router.use(authorize(Roles.ADMIN) );

router.post('/', validate(createUserSchema), userController.createUser);
router.get('/:id', userController.getUser);
router.patch('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
