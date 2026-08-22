import { z } from 'zod';

export const createExpenseSchema = z.object({
  tripStopId: z.string().uuid().optional().nullable(),
  activityId: z.string().uuid().optional().nullable(),
  accommodationId: z.string().uuid().optional().nullable(),
  transportId: z.string().uuid().optional().nullable(),
  category: z.enum(['TRANSPORT', 'ACCOMMODATION', 'ACTIVITY', 'FOOD', 'SHOPPING', 'OTHER']),
  title: z.string().min(1, 'Title is required').max(200),
  estimatedAmount: z.number().min(0).optional().nullable(),
  actualAmount: z.number().min(0).optional().nullable(),
  currency: z.string().length(3).optional().default('USD'),
  expenseDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateExpenseSchema = z.object({
  category: z.enum(['TRANSPORT', 'ACCOMMODATION', 'ACTIVITY', 'FOOD', 'SHOPPING', 'OTHER']).optional(),
  title: z.string().min(1).max(200).optional(),
  estimatedAmount: z.number().min(0).optional().nullable(),
  actualAmount: z.number().min(0).optional().nullable(),
  currency: z.string().length(3).optional(),
  expenseDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional().nullable(),
  notes: z.string().optional().nullable(),
});
