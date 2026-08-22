import { Router } from 'express';
import * as shareController from '../controllers/shareController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.put('/trips/:tripId', authenticate, shareController.toggleShare);
router.get('/:shareToken', shareController.getSharedTrip); // Public route
router.post('/:shareToken/copy', authenticate, shareController.copyTrip);

export default router;
