import { Router } from 'express';
import * as tripController from '../controllers/tripController.js';
import * as stopController from '../controllers/stopController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTripSchema, updateTripSchema } from '../validators/tripValidator.js';
import { addStopSchema, updateStopSchema, reorderStopsSchema } from '../validators/stopValidator.js';

const router = Router();

// Trip CRUD
router.get('/', authenticate, tripController.getTrips);
router.post('/', authenticate, validate(createTripSchema), tripController.createTrip);
router.get('/recent', authenticate, tripController.getRecentTrips);
router.get('/upcoming', authenticate, tripController.getUpcomingTrips);
router.get('/:id', authenticate, tripController.getTrip);
router.put('/:id', authenticate, validate(updateTripSchema), tripController.updateTrip);
router.delete('/:id', authenticate, tripController.deleteTrip);

// Trip stops
router.get('/:tripId/stops', authenticate, stopController.getStops);
router.post('/:tripId/stops', authenticate, validate(addStopSchema), stopController.addStop);
router.put('/:tripId/stops/reorder', authenticate, validate(reorderStopsSchema), stopController.reorderStops);
router.put('/stops/:stopId', authenticate, validate(updateStopSchema), stopController.updateStop);
router.delete('/stops/:stopId', authenticate, stopController.deleteStop);

export default router;
