import { Router } from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createExpenseSchema, updateExpenseSchema } from '../validators/expenseValidator.js';

const router = Router();

router.get('/trips/:tripId', authenticate, expenseController.getExpenses);
router.post('/trips/:tripId', authenticate, validate(createExpenseSchema), expenseController.createExpense);
router.put('/:id', authenticate, validate(updateExpenseSchema), expenseController.updateExpense);
router.delete('/:id', authenticate, expenseController.deleteExpense);

export default router;
