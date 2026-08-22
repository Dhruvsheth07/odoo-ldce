import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, userController.getProfile);
router.put('/me', authenticate, userController.updateProfile);
router.delete('/me', authenticate, userController.deleteAccount);

export default router;
