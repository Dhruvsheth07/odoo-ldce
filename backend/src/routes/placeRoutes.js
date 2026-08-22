import { Router } from 'express';
import * as placeController from '../controllers/placeController.js';
import { authenticate } from '../middleware/auth.js';
import { externalApiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/search', authenticate, externalApiLimiter, placeController.searchPlaces);
router.get('/nearby', authenticate, externalApiLimiter, placeController.getNearbyPlaces);
router.get('/:placeId', authenticate, externalApiLimiter, placeController.getPlaceDetails);

export default router;
