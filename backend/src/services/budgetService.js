import prisma from '../config/db.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { toNumber } from '../utils/helpers.js';

/**
 * Get budget analytics for a trip
 * All values are dynamically calculated from expenses
 */
export async function getTripBudget(tripId, userId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      expenses: {
        orderBy: { expenseDate: 'asc' },
      },
    },
  });

  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const totalBudget = toNumber(trip.budget) || 0;
  const expenses = trip.expenses;

  // Calculate totals
  let totalSpent = 0;
  let totalEstimated = 0;
  const categoryBreakdown = {};
  const dailySpending = {};

  const categories = ['TRANSPORT', 'ACCOMMODATION', 'ACTIVITY', 'FOOD', 'SHOPPING', 'OTHER'];
  categories.forEach(cat => { categoryBreakdown[cat] = { estimated: 0, actual: 0 }; });

  expenses.forEach(expense => {
    const actual = toNumber(expense.actualAmount) || 0;
    const estimated = toNumber(expense.estimatedAmount) || 0;

    totalSpent += actual || estimated; // Use actual if available, else estimated
    totalEstimated += estimated;

    // Category breakdown
    if (categoryBreakdown[expense.category]) {
      categoryBreakdown[expense.category].actual += actual;
      categoryBreakdown[expense.category].estimated += estimated;
    }

    // Daily spending
    if (expense.expenseDate) {
      const dateKey = new Date(expense.expenseDate).toISOString().split('T')[0];
      if (!dailySpending[dateKey]) dailySpending[dateKey] = 0;
      dailySpending[dateKey] += actual || estimated;
    }
  });

  const remaining = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

  // Calculate trip duration for average daily spending
  const tripStart = new Date(trip.startDate);
  const tripEnd = new Date(trip.endDate);
  const tripDays = Math.max(1, Math.ceil((tripEnd - tripStart) / (1000 * 60 * 60 * 24)));
  const averageDailySpending = totalSpent / tripDays;

  // Build daily spending array sorted by date
  const dailySpendingArray = Object.entries(dailySpending)
    .map(([date, amount]) => ({ date, amount: Math.round(amount * 100) / 100 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Category breakdown array
  const categoryBreakdownArray = Object.entries(categoryBreakdown)
    .map(([category, amounts]) => ({
      category,
      estimated: Math.round(amounts.estimated * 100) / 100,
      actual: Math.round(amounts.actual * 100) / 100,
      total: Math.round((amounts.actual || amounts.estimated) * 100) / 100,
    }))
    .filter(cat => cat.total > 0 || cat.estimated > 0);

  return {
    totalBudget,
    totalSpent: Math.round(totalSpent * 100) / 100,
    totalEstimated: Math.round(totalEstimated * 100) / 100,
    remaining: Math.round(remaining * 100) / 100,
    percentageUsed,
    isOverBudget,
    overBudgetAmount: isOverBudget ? Math.round((totalSpent - totalBudget) * 100) / 100 : 0,
    currency: trip.currency,
    averageDailySpending: Math.round(averageDailySpending * 100) / 100,
    tripDays,
    categoryBreakdown: categoryBreakdownArray,
    dailySpending: dailySpendingArray,
    expenseCount: expenses.length,
  };
}
