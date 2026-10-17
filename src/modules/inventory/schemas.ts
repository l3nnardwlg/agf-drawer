import { z } from 'zod';
import {
  InventoryCategory,
  ConnectorGender,
  UnitStatus,
} from '@prisma/client';

export const createGenericItemSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  category: z.nativeEnum(InventoryCategory),
  itemType: z.string().min(1).max(100),
  manufacturer: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  internalReference: z.string().max(100).optional().nullable(),
  tags: z.array(z.string().min(1).max(50)).default([]),
  metadata: z.record(z.unknown()).optional(),
});

export const updateGenericItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  category: z.nativeEnum(InventoryCategory).optional(),
  itemType: z.string().min(1).max(100).optional(),
  manufacturer: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  internalReference: z.string().max(100).optional().nullable(),
  tags: z.array(z.string().min(1).max(50)).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Cable Specific Endpoint
export const cableEndpointInputSchema = z.object({
  position: z.string().min(1).max(10), // 'A', 'B', '1', etc.
  connectorName: z.string().min(1).max(100),
  gender: z.nativeEnum(ConnectorGender).default(ConnectorGender.MALE),
  pinout: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

// Create Cable Item (with specialized fields and initial physical units)
export const createCableSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  connectorA: z.string().min(1).max(100),
  connectorB: z.string().min(1).max(100),
  connectorAGender: z.nativeEnum(ConnectorGender).default(ConnectorGender.MALE),
  connectorBGender: z.nativeEnum(ConnectorGender).default(ConnectorGender.MALE),
  endpoints: z.array(cableEndpointInputSchema).optional(), // For multi-ended / breakout
  color: z.string().max(50).optional().nullable(),
  lengthCm: z.coerce.number().int().positive().optional().nullable(),
  cableStandard: z.string().max(100).optional().nullable(),
  manufacturer: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  internalReference: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  tags: z.array(z.string().min(1).max(50)).default([]),
  specifications: z.record(z.unknown()).optional(),
  // Initial unit provisioning
  quantity: z.coerce.number().int().min(0).max(1000).default(1),
  locationId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(UnitStatus).default(UnitStatus.STORED),
  usageLocation: z.string().max(200).optional().nullable(),
});

export const updateCableSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  connectorA: z.string().min(1).max(100).optional(),
  connectorB: z.string().min(1).max(100).optional(),
  connectorAGender: z.nativeEnum(ConnectorGender).optional(),
  connectorBGender: z.nativeEnum(ConnectorGender).optional(),
  color: z.string().max(50).optional().nullable(),
  lengthCm: z.coerce.number().int().positive().optional().nullable(),
  cableStandard: z.string().max(100).optional().nullable(),
  manufacturer: z.string().max(100).optional().nullable(),
  model: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  tags: z.array(z.string().min(1).max(50)).optional(),
  specifications: z.record(z.unknown()).optional(),
});

// Physical Unit
export const createUnitSchema = z.object({
  unitIdentifier: z.string().max(100).optional().nullable(),
  serialNumber: z.string().max(100).optional().nullable(),
  assetTag: z.string().max(100).optional().nullable(),
  status: z.nativeEnum(UnitStatus).default(UnitStatus.STORED),
  storageLocationId: z.string().uuid().optional().nullable(),
  usageLocation: z.string().max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateUnitSchema = z.object({
  unitIdentifier: z.string().max(100).optional().nullable(),
  serialNumber: z.string().max(100).optional().nullable(),
  assetTag: z.string().max(100).optional().nullable(),
  status: z.nativeEnum(UnitStatus).optional(),
  storageLocationId: z.string().uuid().optional().nullable(),
  usageLocation: z.string().max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  expectedVersion: z.coerce.number().int().optional(), // Optimistic locking
});

export type CreateGenericItemInput = z.infer<typeof createGenericItemSchema>;
export type UpdateGenericItemInput = z.infer<typeof updateGenericItemSchema>;
export type CreateCableInput = z.infer<typeof createCableSchema>;
export type UpdateCableInput = z.infer<typeof updateCableSchema>;
export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
