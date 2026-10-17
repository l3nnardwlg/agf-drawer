import { MovementAction, Prisma } from '@prisma/client';
import { prisma } from '../../database/client.js';
import { BadRequestError, NotFoundError } from '../../types/errors.js';
import { CreateLocationInput, UpdateLocationInput } from './schemas.js';
import { recordMovement } from '../movements/index.js';

export interface StorageLocationNode {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  description: string | null;
  referenceCode: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  unitCount?: number;
  children: StorageLocationNode[];
}

export async function checkHierarchyCycle(
  workspaceId: string,
  locationId: string,
  candidateParentId: string
): Promise<boolean> {
  if (locationId === candidateParentId) {
    return true;
  }

  // Use PostgreSQL recursive CTE to check if candidateParentId is a descendant of locationId
  const result = await prisma.$queryRaw<Array<{ id: string }>>`
    WITH RECURSIVE descendants AS (
      SELECT id, "parentId"
      FROM storage_locations
      WHERE "parentId" = ${locationId}::uuid AND "workspaceId" = ${workspaceId}::uuid
      UNION ALL
      SELECT sl.id, sl."parentId"
      FROM storage_locations sl
      INNER JOIN descendants d ON sl."parentId" = d.id
      WHERE sl."workspaceId" = ${workspaceId}::uuid
    )
    SELECT id FROM descendants WHERE id = ${candidateParentId}::uuid LIMIT 1;
  `;

  return result.length > 0;
}

export async function createLocation(
  workspaceId: string,
  input: CreateLocationInput,
  actorUserId?: string
) {
  if (input.parentId) {
    const parent = await prisma.storageLocation.findFirst({
      where: { id: input.parentId, workspaceId },
    });
    if (!parent) {
      throw new BadRequestError(
        'Parent location not found or belongs to another workspace',
        'INVALID_PARENT_LOCATION'
      );
    }
  }

  const location = await prisma.$transaction(async (tx) => {
    const created = await tx.storageLocation.create({
      data: {
        workspaceId,
        name: input.name,
        type: input.type,
        parentId: input.parentId ?? null,
        description: input.description ?? null,
        referenceCode: input.referenceCode ?? null,
        sortOrder: input.sortOrder ?? 0,
      },
    });

    await recordMovement(tx, {
      workspaceId,
      actorId: actorUserId,
      action: MovementAction.LOCATION_CREATED,
      newState: created as unknown as Prisma.InputJsonValue,
      reason: `Created storage location "${created.name}" (${created.type})`,
    });

    return created;
  });

  return location;
}

export async function updateLocation(
  workspaceId: string,
  locationId: string,
  input: UpdateLocationInput,
  actorUserId?: string
) {
  const existing = await prisma.storageLocation.findFirst({
    where: { id: locationId, workspaceId },
  });

  if (!existing) {
    throw new NotFoundError('Storage location not found');
  }

  if (input.parentId !== undefined && input.parentId !== null) {
    // Check cross-workspace parent
    const parent = await prisma.storageLocation.findFirst({
      where: { id: input.parentId, workspaceId },
    });
    if (!parent) {
      throw new BadRequestError(
        'Parent location not found or belongs to another workspace',
        'INVALID_PARENT_LOCATION'
      );
    }

    // Check circular relationship
    const isCycle = await checkHierarchyCycle(workspaceId, locationId, input.parentId);
    if (isCycle) {
      throw new BadRequestError(
        'Cannot set a child or descendant location as the parent (circular hierarchy)',
        'CIRCULAR_HIERARCHY_DETECTED'
      );
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const res = await tx.storageLocation.update({
      where: { id: locationId },
      data: {
        name: input.name,
        type: input.type,
        parentId: input.parentId,
        description: input.description,
        referenceCode: input.referenceCode,
        sortOrder: input.sortOrder,
      },
    });

    const isMoved = input.parentId !== undefined && input.parentId !== existing.parentId;
    await recordMovement(tx, {
      workspaceId,
      actorId: actorUserId,
      action: isMoved ? MovementAction.LOCATION_MOVED : MovementAction.ITEM_UPDATED,
      previousState: existing as unknown as Prisma.InputJsonValue,
      newState: res as unknown as Prisma.InputJsonValue,
      reason: isMoved
        ? `Moved location "${res.name}" to new parent`
        : `Updated location "${res.name}"`,
    });

    return res;
  });

  return updated;
}

export async function listLocations(workspaceId: string, parentId?: string | null) {
  const where: Prisma.StorageLocationWhereInput = {
    workspaceId,
  };

  if (parentId !== undefined) {
    where.parentId = parentId;
  }

  const locations = await prisma.storageLocation.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      _count: {
        select: {
          children: true,
          units: true,
        },
      },
    },
  });

  return locations.map((loc) => ({
    ...loc,
    childCount: loc._count.children,
    unitCount: loc._count.units,
  }));
}

export async function getLocationTree(workspaceId: string): Promise<StorageLocationNode[]> {
  const allLocations = await prisma.storageLocation.findMany({
    where: { workspaceId },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      _count: {
        select: { units: true },
      },
    },
  });

  const nodeMap = new Map<string, StorageLocationNode>();
  const rootNodes: StorageLocationNode[] = [];

  for (const loc of allLocations) {
    nodeMap.set(loc.id, {
      id: loc.id,
      name: loc.name,
      type: loc.type,
      parentId: loc.parentId,
      description: loc.description,
      referenceCode: loc.referenceCode,
      sortOrder: loc.sortOrder,
      createdAt: loc.createdAt,
      updatedAt: loc.updatedAt,
      unitCount: loc._count.units,
      children: [],
    });
  }

  for (const loc of allLocations) {
    const node = nodeMap.get(loc.id)!;
    if (loc.parentId && nodeMap.has(loc.parentId)) {
      nodeMap.get(loc.parentId)!.children.push(node);
    } else {
      rootNodes.push(node);
    }
  }

  return rootNodes;
}

export async function deleteLocation(
  workspaceId: string,
  locationId: string,
  actorUserId?: string
) {
  const location = await prisma.storageLocation.findFirst({
    where: { id: locationId, workspaceId },
    include: {
      _count: {
        select: {
          children: true,
          units: true,
        },
      },
    },
  });

  if (!location) {
    throw new NotFoundError('Storage location not found');
  }

  if (location._count.children > 0) {
    throw new BadRequestError(
      'Cannot delete location containing child locations. Remove or reparent them first.',
      'LOCATION_HAS_CHILDREN'
    );
  }

  if (location._count.units > 0) {
    throw new BadRequestError(
      'Cannot delete location containing stored inventory units. Relocate items first.',
      'LOCATION_HAS_UNITS'
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.storageLocation.delete({
      where: { id: locationId },
    });

    await recordMovement(tx, {
      workspaceId,
      actorId: actorUserId,
      action: MovementAction.LOCATION_DELETED,
      previousState: location as unknown as Prisma.InputJsonValue,
      reason: `Deleted storage location "${location.name}"`,
    });
  });
}
