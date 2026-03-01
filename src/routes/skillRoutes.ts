import { Router } from 'express';
import * as skillController from '../controllers/skillController';
import { authenticateRequest, isAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', skillController.getSkills);

const isDev = process.env.NODE_ENV === 'development';
const auth = isDev ? (_req: any, _res: any, next: any) => next() : [authenticateRequest, isAdmin];

// Admin routes (Protected)
router.post('/admin', auth, skillController.createSkill);
router.patch('/admin/:id', auth, skillController.updateSkill);
router.delete('/admin/:id', auth, skillController.deleteSkill);

export default router;
