import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { authenticateRequest, isAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', projectController.getProjects);
router.get('/:slug', projectController.getProjectBySlug);

// Admin routes (Protected)
router.get('/admin', authenticateRequest, isAdmin, projectController.adminGetProjects);
router.post('/admin', authenticateRequest, isAdmin, upload.array('images', 5), projectController.createProject);
router.patch('/admin/:id', authenticateRequest, isAdmin, upload.array('images', 5), projectController.updateProject);
router.delete('/admin/:id', authenticateRequest, isAdmin, projectController.deleteProject);

export default router;
