import { Router } from 'express';
import * as budgetController from '../controllers/budgetController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/trips/:tripId', authenticate, budgetController.getBudget);

export default router;
