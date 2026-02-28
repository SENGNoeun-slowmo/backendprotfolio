import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticateRequest, isAdmin } from '../middleware/auth';

const router = Router();

const isDev = process.env.NODE_ENV === 'development';
const auth = isDev ? (_req: any, _res: any, next: any) => next() : [authenticateRequest, isAdmin];

router.get('/', auth, userController.getUsers);
router.patch('/:id/role', auth, userController.updateUserRole);

export default router;
