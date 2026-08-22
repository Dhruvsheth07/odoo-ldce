import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import tripRoutes from './tripRoutes.js';
import placeRoutes from './placeRoutes.js';
import activityRoutes from './activityRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import transportRoutes from './transportRoutes.js';
import flightRoutes from './flightRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import calendarRoutes from './calendarRoutes.js';
import shareRoutes from './shareRoutes.js';
import savedDestinationRoutes from './savedDestinationRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/places', placeRoutes);
router.use('/activities', activityRoutes);
router.use('/hotels', hotelRoutes);
router.use('/transport', transportRoutes);
router.use('/flights', flightRoutes);
router.use('/expenses', expenseRoutes);
router.use('/budget', budgetRoutes);
router.use('/calendar', calendarRoutes);
router.use('/share', shareRoutes);
router.use('/saved-destinations', savedDestinationRoutes);

export default router;
