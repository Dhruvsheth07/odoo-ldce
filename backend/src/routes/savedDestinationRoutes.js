import { Router } from 'express';
import * as savedDestinationController from '../controllers/savedDestinationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, savedDestinationController.getSaved);
router.post('/', authenticate, savedDestinationController.saveDestination);
router.delete('/:id', authenticate, savedDestinationController.unsaveDestination);

export default router;
