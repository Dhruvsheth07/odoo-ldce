import { Router } from 'express';
import * as flightController from '../controllers/flightController.js';
import { authenticate } from '../middleware/auth.js';
import { externalApiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/search', authenticate, externalApiLimiter, flightController.searchFlights);

export default router;
