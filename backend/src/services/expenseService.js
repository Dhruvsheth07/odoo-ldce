import prisma from '../config/db.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { toNumber } from '../utils/helpers.js';

/**
 * Get all expenses for a trip
 */
export async function getTripExpenses(tripId, userId, { category, stopId } = {}) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const where = { tripId };
  if (category) where.category = category;
  if (stopId) where.tripStopId = stopId;

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      tripStop: { include: { destination: true } },
      activity: { select: { name: true } },
      accommodation: { select: { name: true } },
      transport: { select: { transportType: true, carrier: true } },
    },
    orderBy: { expenseDate: 'asc' },
  });

  return expenses.map(e => ({
    ...e,
    estimatedAmount: toNumber(e.estimatedAmount),
    actualAmount: toNumber(e.actualAmount),
  }));
}

/**
 * Create a new expense
 */
export async function createExpense(tripId, userId, data) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new NotFoundError('Trip');
  if (trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const expense = await prisma.expense.create({
    data: {
      tripId,
      tripStopId: data.tripStopId || null,
      activityId: data.activityId || null,
      accommodationId: data.accommodationId || null,
      transportId: data.transportId || null,
      category: data.category,
      title: data.title,
      estimatedAmount: data.estimatedAmount || null,
      actualAmount: data.actualAmount || null,
      currency: data.currency || trip.currency,
      expenseDate: data.expenseDate ? new Date(data.expenseDate) : null,
      notes: data.notes || null,
    },
    include: {
      tripStop: { include: { destination: true } },
    },
  });

  return {
    ...expense,
    estimatedAmount: toNumber(expense.estimatedAmount),
    actualAmount: toNumber(expense.actualAmount),
  };
}

/**
 * Update an expense
 */
export async function updateExpense(expenseId, userId, data) {
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: { trip: true },
  });
  if (!expense) throw new NotFoundError('Expense');
  if (expense.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  const updateData = {};
  if (data.category !== undefined) updateData.category = data.category;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.estimatedAmount !== undefined) updateData.estimatedAmount = data.estimatedAmount;
  if (data.actualAmount !== undefined) updateData.actualAmount = data.actualAmount;
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.expenseDate !== undefined) updateData.expenseDate = data.expenseDate ? new Date(data.expenseDate) : null;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const updated = await prisma.expense.update({
    where: { id: expenseId },
    data: updateData,
    include: {
      tripStop: { include: { destination: true } },
    },
  });

  return {
    ...updated,
    estimatedAmount: toNumber(updated.estimatedAmount),
    actualAmount: toNumber(updated.actualAmount),
  };
}

/**
 * Delete an expense
 */
export async function deleteExpense(expenseId, userId) {
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: { trip: true },
  });
  if (!expense) throw new NotFoundError('Expense');
  if (expense.trip.userId !== userId) throw new ForbiddenError('You do not own this trip');

  await prisma.expense.delete({ where: { id: expenseId } });
  return { deleted: true };
}
