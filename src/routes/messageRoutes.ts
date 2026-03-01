import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { authenticateRequest, isAdmin } from '../middleware/auth';

const router = Router();

// Public route to send a message
router.post('/', messageController.sendMessage);

// Protected routes for admin to manage messages
const isDev = process.env.NODE_ENV === 'development';
const auth = isDev ? (_req: any, _res: any, next: any) => next() : [authenticateRequest, isAdmin];

router.get('/', auth, messageController.getMessages);
router.patch('/:id/status', auth, messageController.updateMessageStatus);
router.delete('/:id', auth, messageController.deleteMessage);

export default router;
