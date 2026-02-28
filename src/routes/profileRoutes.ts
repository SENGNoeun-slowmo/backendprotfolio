import { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { authenticateRequest, isAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public route (Get admin profile for portfolio)
router.get('/', profileController.getAdminProfile);

// Admin protected route
const adminAuth = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === 'development') return next();
  authenticateRequest(req, res, next);
};

const adminCheck = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === 'development') return next();
  isAdmin(req, res, next);
};

router.patch('/admin', adminAuth, adminCheck, upload.single('avatar'), profileController.updateProfile);

export default router;
