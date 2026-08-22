import { Router } from 'express';
import * as transportController from '../controllers/transportController.js';
import { authenticate } from '../middleware/auth.js';
import { externalApiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/search', authenticate, externalApiLimiter, transportController.searchTransport);
router.post('/trips/:tripId', authenticate, transportController.addTransport);
router.delete('/:transportId', authenticate, transportController.deleteTransport);

export default router;
