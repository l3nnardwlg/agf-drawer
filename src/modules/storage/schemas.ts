import { z } from 'zod';
import { LocationType } from '@prisma/client';

export const createLocationSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(LocationType),
  parentId: z.string().uuid().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  referenceCode: z.string().max(50).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export const updateLocationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.nativeEnum(LocationType).optional(),
  parentId: z.string().uuid().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  referenceCode: z.string().max(50).optional().nullable(),
  sortOrder: z.coerce.number().int().optional(),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
