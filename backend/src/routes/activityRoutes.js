import { Router } from 'express';
import * as activityController from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';
import { externalApiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/search', authenticate, externalApiLimiter, activityController.searchActivities);
router.post('/stops/:stopId', authenticate, activityController.addActivity);
router.put('/:activityId/schedule', authenticate, activityController.updateSchedule);
router.delete('/:activityId', authenticate, activityController.deleteActivity);

export default router;
