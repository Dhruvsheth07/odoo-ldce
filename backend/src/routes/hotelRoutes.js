import { Router } from 'express';
import * as hotelController from '../controllers/hotelController.js';
import { authenticate } from '../middleware/auth.js';
import { externalApiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/search', authenticate, externalApiLimiter, hotelController.searchHotels);
router.post('/stops/:stopId', authenticate, hotelController.addHotel);
router.delete('/:accommodationId', authenticate, hotelController.deleteHotel);

export default router;
