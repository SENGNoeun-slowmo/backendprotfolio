import { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { authenticateRequest, isAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public route (Get admin profile for portfolio)
router.get('/', profileController.getAdminProfile);

// Admin protected route
const isDev = process.env.NODE_ENV === 'development';
const auth = isDev ? (_req: any, _res: any, next: any) => next() : [authenticateRequest, isAdmin];

router.patch('/admin', auth, upload.single('avatar'), profileController.updateProfile);

export default router;
