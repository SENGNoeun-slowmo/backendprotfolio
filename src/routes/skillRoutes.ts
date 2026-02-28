import { Router } from 'express';
import * as skillController from '../controllers/skillController';
import { authenticateRequest, isAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', skillController.getSkills);

// Admin routes (Protected)
router.post('/admin', authenticateRequest, isAdmin, skillController.createSkill);
router.patch('/admin/:id', authenticateRequest, isAdmin, skillController.updateSkill);
router.delete('/admin/:id', authenticateRequest, isAdmin, skillController.deleteSkill);

export default router;
