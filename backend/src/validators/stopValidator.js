import { z } from 'zod';

export const addStopSchema = z.object({
  destinationName: z.string().min(1, 'Destination name is required'),
  country: z.string().optional().nullable(),
  placeId: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  arrivalDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid arrival date'),
  departureDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid departure date'),
  notes: z.string().optional().nullable(),
});

export const updateStopSchema = z.object({
  arrivalDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
  departureDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid date').optional(),
  notes: z.string().optional().nullable(),
  orderIndex: z.number().int().min(0).optional(),
});

export const reorderStopsSchema = z.object({
  stopIds: z.array(z.string().uuid()).min(1, 'At least one stop ID required'),
});
