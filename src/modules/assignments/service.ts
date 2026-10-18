import { MovementAction, UnitStatus, Prisma } from '@prisma/client';
import { prisma } from '../../database/client.js';
import { BadRequestError, NotFoundError } from '../../types/errors.js';
import {
  AssignCableInput,
  ReturnCableInput,
  MoveUsageLocationInput,
} from './schemas.js';
import { recordMovement } from '../movements/index.js';

export async function assignCable(
  workspaceId: string,
  input: AssignCableInput,
  actorUserId: string
) {
  const unit = await prisma.inventoryUnit.findFirst({
    where: { id: input.unitId, workspaceId },
    include: { item: true },
  });

  if (!unit) {
    throw new NotFoundError('Cable unit not found', 'UNIT_NOT_FOUND');
  }

  if (unit.status !== UnitStatus.STORED) {
    throw new BadRequestError(
      `Cannot assign cable unit with status "${unit.status}". Only stored units can be assigned.`,
      'UNIT_NOT_AVAILABLE'
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create CableAssignment record
    const assignment = await tx.cableAssignment.create({
      data: {
        unitId: unit.id,
        workspaceId,
        usageLocation: input.usageLocation,
        assignedDevice: input.assignedDevice ?? null,
        purpose: input.purpose ?? null,
        notes: input.notes ?? null,
        assignedById: actorUserId,
      },
    });

    // 2. Update unit status to IN_USE and clear storage location
    const updatedUnit = await tx.inventoryUnit.update({
      where: { id: unit.id },
      data: {
        status: UnitStatus.IN_USE,
        storageLocationId: null,
        usageLocation: input.usageLocation,
        version: unit.version + 1,
      },
    });

    // 3. Record movement in history
    await recordMovement(tx, {
      workspaceId,
      itemId: unit.itemId,
      unitId: unit.id,
      actorId: actorUserId,
      action: MovementAction.UNIT_ASSIGNED,
      previousState: unit as unknown as Prisma.InputJsonValue,
      newState: updatedUnit as unknown as Prisma.InputJsonValue,
      reason: `Assigned cable to ${input.usageLocation}${input.assignedDevice ? ` (${input.assignedDevice})` : ''}`,
    });

    return { assignment, unit: updatedUnit };
  });

  return result;
}

export async function returnCable(
  workspaceId: string,
  input: ReturnCableInput,
  actorUserId: string
) {
  const unit = await prisma.inventoryUnit.findFirst({
    where: { id: input.unitId, workspaceId },
    include: { item: true },
  });

  if (!unit) {
    throw new NotFoundError('Cable unit not found', 'UNIT_NOT_FOUND');
  }

  if (unit.status !== UnitStatus.IN_USE && unit.status !== UnitStatus.LOANED) {
    throw new BadRequestError(
      `Cannot return cable unit with status "${unit.status}". Only in-use or loaned units can be returned.`,
      'UNIT_NOT_IN_USE'
    );
  }

  // Validate storage location
  const loc = await prisma.storageLocation.findFirst({
    where: { id: input.storageLocationId, workspaceId },
  });
  if (!loc) {
    throw new BadRequestError('Storage location not found in workspace', 'INVALID_LOCATION');
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Find and close any active assignment
    const activeAssignment = await tx.cableAssignment.findFirst({
      where: {
        unitId: unit.id,
        workspaceId,
        returnedAt: null,
      },
      orderBy: { assignedAt: 'desc' },
    });

    if (activeAssignment) {
      await tx.cableAssignment.update({
        where: { id: activeAssignment.id },
        data: { returnedAt: new Date() },
      });
    }

    // 2. Update unit status to STORED, clear usage location, set storage location
    const updatedUnit = await tx.inventoryUnit.update({
      where: { id: unit.id },
      data: {
        status: UnitStatus.STORED,
        storageLocationId: input.storageLocationId,
        usageLocation: null,
        notes: input.notes !== undefined ? input.notes : unit.notes,
        version: unit.version + 1,
      },
      include: {
        storageLocation: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    // 3. Record movement in history
    await recordMovement(tx, {
      workspaceId,
      itemId: unit.itemId,
      unitId: unit.id,
      actorId: actorUserId,
      action: MovementAction.UNIT_RETURNED,
      previousState: unit as unknown as Prisma.InputJsonValue,
      newState: updatedUnit as unknown as Prisma.InputJsonValue,
      reason: `Returned cable to storage location "${loc.name}"`,
    });

    return updatedUnit;
  });

  return result;
}

export async function moveCableUsageLocation(
  workspaceId: string,
  input: MoveUsageLocationInput,
  actorUserId: string
) {
  const unit = await prisma.inventoryUnit.findFirst({
    where: { id: input.unitId, workspaceId },
  });

  if (!unit) {
    throw new NotFoundError('Cable unit not found', 'UNIT_NOT_FOUND');
  }

  if (unit.status !== UnitStatus.IN_USE) {
    throw new BadRequestError('Only cables currently in use can be moved to another usage location', 'UNIT_NOT_IN_USE');
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Close current active assignment
    await tx.cableAssignment.updateMany({
      where: { unitId: unit.id, workspaceId, returnedAt: null },
      data: { returnedAt: new Date() },
    });

    // 2. Open new assignment
    const newAssignment = await tx.cableAssignment.create({
      data: {
        unitId: unit.id,
        workspaceId,
        usageLocation: input.newUsageLocation,
        assignedDevice: input.assignedDevice ?? null,
        notes: input.notes ?? null,
        assignedById: actorUserId,
      },
    });

    // 3. Update unit usageLocation
    const updatedUnit = await tx.inventoryUnit.update({
      where: { id: unit.id },
      data: {
        usageLocation: input.newUsageLocation,
        version: unit.version + 1,
      },
    });

    // 4. Record movement
    await recordMovement(tx, {
      workspaceId,
      itemId: unit.itemId,
      unitId: unit.id,
      actorId: actorUserId,
      action: MovementAction.UNIT_MOVED,
      previousState: unit as unknown as Prisma.InputJsonValue,
      newState: updatedUnit as unknown as Prisma.InputJsonValue,
      reason: `Moved cable usage location to "${input.newUsageLocation}"`,
    });

    return { assignment: newAssignment, unit: updatedUnit };
  });

  return result;
}

export async function listAssignments(
  workspaceId: string,
  options: {
    activeOnly?: boolean;
    usageLocation?: string;
  }
) {
  const where: Prisma.CableAssignmentWhereInput = {
    workspaceId,
  };

  if (options.activeOnly) {
    where.returnedAt = null;
  }

  if (options.usageLocation) {
    where.usageLocation = { contains: options.usageLocation, mode: 'insensitive' };
  }

  const assignments = await prisma.cableAssignment.findMany({
    where,
    include: {
      unit: {
        include: {
          item: {
            select: { id: true, name: true, category: true },
          },
        },
      },
      assignedBy: {
        select: { id: true, username: true, displayName: true },
      },
    },
    orderBy: { assignedAt: 'desc' },
  });

  return assignments;
}
