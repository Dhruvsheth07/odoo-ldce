import { Router } from 'express';
import * as calendarController from '../controllers/calendarController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/trips/:tripId', authenticate, calendarController.getCalendar);

export default router;
