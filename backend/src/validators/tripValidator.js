import { z } from 'zod';

export const createTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required').max(200),
  description: z.string().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid start date'),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid end date'),
  budget: z.number().min(0).optional().default(0),
  currency: z.string().length(3).optional().default('USD'),
});

export const updateTripSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid start date').optional(),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid end date').optional(),
  budget: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  isPublic: z.boolean().optional(),
});
