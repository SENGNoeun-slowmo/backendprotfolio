import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { authenticateRequest, isAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', projectController.getProjects);
router.get('/:slug', projectController.getProjectBySlug);

const isDev = process.env.NODE_ENV === 'development';
const auth = isDev ? (_req: any, _res: any, next: any) => next() : [authenticateRequest, isAdmin];

// Admin routes (Protected)
router.get('/admin', auth, projectController.adminGetProjects);
router.post('/admin', auth, upload.array('images', 5), projectController.createProject);
router.patch('/admin/:id', auth, upload.array('images', 5), projectController.updateProject);
router.delete('/admin/:id', auth, projectController.deleteProject);

export default router;
