import * as budgetService from '../services/budgetService.js';
import { success } from '../utils/apiResponse.js';

export async function getBudget(req, res, next) {
  try {
    const budget = await budgetService.getTripBudget(req.params.tripId, req.user.id);
    success(res, { budget });
  } catch (err) { next(err); }
}
