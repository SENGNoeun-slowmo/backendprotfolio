import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { authenticateRequest, isAdmin } from '../middleware/auth';

const router = Router();

// Public route to send a message
router.post('/', messageController.sendMessage);

// Protected routes for admin to manage messages
const adminAuth = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === 'development') return next();
  authenticateRequest(req, res, next);
};

const adminCheck = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === 'development') return next();
  isAdmin(req, res, next);
};

router.get('/', adminAuth, adminCheck, messageController.getMessages);
router.patch('/:id/status', adminAuth, adminCheck, messageController.updateMessageStatus);
router.delete('/:id', adminAuth, adminCheck, messageController.deleteMessage);

export default router;
