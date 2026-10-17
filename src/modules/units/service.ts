import { MovementAction, UnitStatus, Prisma } from '@prisma/client';
import { prisma } from '../../database/client.js';
import {
  BadRequestError,
  ConcurrencyConflictError,
  NotFoundError,
} from '../../types/errors.js';
import { CreateUnitInput, UpdateUnitInput } from '../inventory/schemas.js';
import { recordMovement } from '../movements/index.js';

export async function addUnit(
  workspaceId: string,
  itemId: string,
  input: CreateUnitInput,
  actorUserId?: string
) {
  const item = await prisma.inventoryItem.findFirst({
    where: { id: itemId, workspaceId },
  });

  if (!item) {
    throw new NotFoundError('Inventory item not found');
  }

  if (input.storageLocationId) {
    const loc = await prisma.storageLocation.findFirst({
      where: { id: input.storageLocationId, workspaceId },
    });
    if (!loc) {
      throw new BadRequestError('Storage location not found in this workspace', 'INVALID_LOCATION');
    }
  }

  const unit = await prisma.$transaction(async (tx) => {
    const created = await tx.inventoryUnit.create({
      data: {
        itemId,
        workspaceId,
        unitIdentifier: input.unitIdentifier ?? null,
        serialNumber: input.serialNumber ?? null,
        assetTag: input.assetTag ?? null,
        status: input.status,
        storageLocationId: input.status === UnitStatus.STORED ? input.storageLocationId : null,
        usageLocation: input.status !== UnitStatus.STORED ? input.usageLocation : null,
        notes: input.notes ?? null,
      },
      include: {
        storageLocation: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    await recordMovement(tx, {
      workspaceId,
      itemId,
      unitId: created.id,
      actorId: actorUserId,
      action: MovementAction.UNIT_ADDED,
      newState: created as unknown as Prisma.InputJsonValue,
      reason: `Added physical unit to item "${item.name}"`,
    });

    return created;
  });

  return unit;
}

export async function updateUnit(
  workspaceId: string,
  unitId: string,
  input: UpdateUnitInput,
  actorUserId?: string
) {
  const existing = await prisma.inventoryUnit.findFirst({
    where: { id: unitId, workspaceId },
    include: { item: true },
  });

  if (!existing) {
    throw new NotFoundError('Inventory unit not found');
  }

  // Optimistic concurrency check
  if (
    input.expectedVersion !== undefined &&
    input.expectedVersion !== existing.version
  ) {
    throw new ConcurrencyConflictError(
      'Unit was modified by another concurrent user. Please refresh and retry.',
      'CONCURRENCY_CONFLICT'
    );
  }

  const nextStatus = input.status ?? existing.status;
  let nextStorageLocationId =
    input.storageLocationId !== undefined
      ? input.storageLocationId
      : existing.storageLocationId;
  let nextUsageLocation =
    input.usageLocation !== undefined ? input.usageLocation : existing.usageLocation;

  if (nextStatus === UnitStatus.STORED) {
    nextUsageLocation = null;
    if (nextStorageLocationId) {
      const loc = await prisma.storageLocation.findFirst({
        where: { id: nextStorageLocationId, workspaceId },
      });
      if (!loc) {
        throw new BadRequestError('Storage location not found in workspace', 'INVALID_LOCATION');
      }
    }
  } else if (nextStatus === UnitStatus.IN_USE || nextStatus === UnitStatus.LOANED) {
    nextStorageLocationId = null;
  }

  // Determine movement action
  let movementAction: MovementAction = MovementAction.UNIT_MOVED;
  if (nextStatus !== existing.status) {
    if (nextStatus === UnitStatus.MISSING) movementAction = MovementAction.UNIT_MARKED_MISSING;
    else if (nextStatus === UnitStatus.RETIRED) movementAction = MovementAction.UNIT_RETIRED;
    else if (nextStatus === UnitStatus.LOANED) movementAction = MovementAction.UNIT_LOANED;
    else if (nextStatus === UnitStatus.STORED) movementAction = MovementAction.UNIT_RETURNED;
    else if (nextStatus === UnitStatus.IN_USE) movementAction = MovementAction.UNIT_ASSIGNED;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const res = await tx.inventoryUnit.update({
      where: { id: unitId },
      data: {
        status: nextStatus,
        storageLocationId: nextStorageLocationId,
        usageLocation: nextUsageLocation,
        unitIdentifier: input.unitIdentifier !== undefined ? input.unitIdentifier : existing.unitIdentifier,
        serialNumber: input.serialNumber !== undefined ? input.serialNumber : existing.serialNumber,
        assetTag: input.assetTag !== undefined ? input.assetTag : existing.assetTag,
        notes: input.notes !== undefined ? input.notes : existing.notes,
        version: existing.version + 1,
      },
      include: {
        storageLocation: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    await recordMovement(tx, {
      workspaceId,
      itemId: existing.itemId,
      unitId: res.id,
      actorId: actorUserId,
      action: movementAction,
      previousState: existing as unknown as Prisma.InputJsonValue,
      newState: res as unknown as Prisma.InputJsonValue,
      reason: `Updated unit status to ${res.status}`,
    });

    return res;
  });

  return updated;
}

export async function getUnit(workspaceId: string, unitId: string) {
  const unit = await prisma.inventoryUnit.findFirst({
    where: { id: unitId, workspaceId },
    include: {
      item: {
        include: {
          cableSpec: {
            include: { endpoints: true },
          },
        },
      },
      storageLocation: true,
      assignments: {
        orderBy: { assignedAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!unit) {
    throw new NotFoundError('Inventory unit not found');
  }

  return unit;
}

export async function listUnits(
  workspaceId: string,
  options: {
    itemId?: string;
    status?: UnitStatus;
    locationId?: string;
  }
) {
  const where: Prisma.InventoryUnitWhereInput = {
    workspaceId,
  };

  if (options.itemId) where.itemId = options.itemId;
  if (options.status) where.status = options.status;
  if (options.locationId) where.storageLocationId = options.locationId;

  const units = await prisma.inventoryUnit.findMany({
    where,
    include: {
      item: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
      storageLocation: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return units;
}
