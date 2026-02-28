import { Router } from 'express';
import * as statsController from '../controllers/statsController';
import { authenticateRequest, isAdmin } from '../middleware/auth';

const router = Router();

const isDev = process.env.NODE_ENV === 'development';
const auth = isDev ? (_req: any, _res: any, next: any) => next() : [authenticateRequest, isAdmin];

router.get('/', auth, statsController.getStats);

export default router;
