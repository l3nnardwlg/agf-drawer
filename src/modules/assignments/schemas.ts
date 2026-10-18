import { z } from 'zod';

export const assignCableSchema = z.object({
  unitId: z.string().uuid(),
  usageLocation: z.string().min(1).max(200),
  assignedDevice: z.string().max(100).optional().nullable(),
  purpose: z.string().max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const returnCableSchema = z.object({
  unitId: z.string().uuid(),
  storageLocationId: z.string().uuid(),
  notes: z.string().max(1000).optional().nullable(),
});

export const moveUsageLocationSchema = z.object({
  unitId: z.string().uuid(),
  newUsageLocation: z.string().min(1).max(200),
  assignedDevice: z.string().max(100).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type AssignCableInput = z.infer<typeof assignCableSchema>;
export type ReturnCableInput = z.infer<typeof returnCableSchema>;
export type MoveUsageLocationInput = z.infer<typeof moveUsageLocationSchema>;
