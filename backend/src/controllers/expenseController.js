import * as expenseService from '../services/expenseService.js';
import { success, created } from '../utils/apiResponse.js';

export async function getExpenses(req, res, next) {
  try {
    const { category, stopId } = req.query;
    const expenses = await expenseService.getTripExpenses(req.params.tripId, req.user.id, { category, stopId });
    success(res, { expenses });
  } catch (err) { next(err); }
}

export async function createExpense(req, res, next) {
  try {
    const expense = await expenseService.createExpense(req.params.tripId, req.user.id, req.body);
    created(res, { expense });
  } catch (err) { next(err); }
}

export async function updateExpense(req, res, next) {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.user.id, req.body);
    success(res, { expense }, 'Expense updated');
  } catch (err) { next(err); }
}

export async function deleteExpense(req, res, next) {
  try {
    await expenseService.deleteExpense(req.params.id, req.user.id);
    success(res, null, 'Expense deleted');
  } catch (err) { next(err); }
}
