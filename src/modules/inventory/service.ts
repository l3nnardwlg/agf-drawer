import {
  InventoryCategory,
  MovementAction,
  UnitStatus,
  Prisma,
} from '@prisma/client';
import { prisma } from '../../database/client.js';
import { BadRequestError, NotFoundError } from '../../types/errors.js';
import {
  CreateCableInput,
  UpdateCableInput,
  CreateGenericItemInput,
  UpdateGenericItemInput,
} from './schemas.js';
import { recordMovement } from '../movements/index.js';

export async function createCable(
  workspaceId: string,
  input: CreateCableInput,
  actorUserId?: string
) {
  // Validate location if provided
  if (input.locationId) {
    const loc = await prisma.storageLocation.findFirst({
      where: { id: input.locationId, workspaceId },
    });
    if (!loc) {
      throw new BadRequestError('Storage location not found in this workspace', 'INVALID_LOCATION');
    }
  }

  // Pre-fetch connectors if they exist in catalog
  const connectorNames = [input.connectorA, input.connectorB];
  const connectors = await prisma.connector.findMany({
    where: {
      OR: [{ workspaceId: null }, { workspaceId }],
      name: { in: connectorNames, mode: 'insensitive' },
    },
  });

  const connMap = new Map<string, string>();
  for (const c of connectors) {
    connMap.set(c.name.toLowerCase(), c.id);
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create generic inventory item
    const item = await tx.inventoryItem.create({
      data: {
        workspaceId,
        name: input.name,
        description: input.description ?? null,
        category: InventoryCategory.CABLE,
        itemType: 'cable',
        manufacturer: input.manufacturer ?? null,
        model: input.model ?? null,
        sku: input.sku ?? null,
        internalReference: input.internalReference ?? null,
        tags: input.tags ?? [],
        createdById: actorUserId ?? null,
      },
    });

    // 2. Create cable specification
    const spec = await tx.cableSpecification.create({
      data: {
        itemId: item.id,
        cableStandard: input.cableStandard ?? null,
        color: input.color ?? null,
        lengthCm: input.lengthCm ?? null,
        notes: input.notes ?? null,
        specifications: input.specifications
          ? (input.specifications as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });

    // 3. Create cable endpoints
    const endpointsToCreate = input.endpoints && input.endpoints.length > 0
      ? input.endpoints
      : [
          {
            position: 'A',
            connectorName: input.connectorA,
            gender: input.connectorAGender,
          },
          {
            position: 'B',
            connectorName: input.connectorB,
            gender: input.connectorBGender,
          },
        ];

    for (const ep of endpointsToCreate) {
      const connId = connMap.get(ep.connectorName.toLowerCase()) ?? null;
      await tx.cableEndpoint.create({
        data: {
          cableSpecId: spec.id,
          position: ep.position,
          connectorName: ep.connectorName,
          gender: ep.gender,
          connectorId: connId,
          pinout: (ep as { pinout?: string | null }).pinout ?? null,
          notes: (ep as { notes?: string | null }).notes ?? null,
        },
      });
    }

    // 4. Create initial units if quantity > 0
    const createdUnits = [];
    if (input.quantity > 0) {
      for (let i = 1; i <= input.quantity; i++) {
        const identifier = input.quantity > 1 ? `#${String(i).padStart(3, '0')}` : undefined;
        const unit = await tx.inventoryUnit.create({
          data: {
            itemId: item.id,
            workspaceId,
            unitIdentifier: identifier,
            status: input.status,
            storageLocationId: input.status === UnitStatus.STORED ? input.locationId : null,
            usageLocation: input.status !== UnitStatus.STORED ? input.usageLocation : null,
          },
        });
        createdUnits.push(unit);
      }
    }

    // 5. Record movement in history
    await recordMovement(tx, {
      workspaceId,
      itemId: item.id,
      actorId: actorUserId,
      action: MovementAction.ITEM_CREATED,
      newState: {
        item,
        spec,
        unitCount: input.quantity,
      } as unknown as Prisma.InputJsonValue,
      reason: `Registered cable type "${item.name}" with ${input.quantity} physical units`,
    });

    return { item, spec, unitCount: createdUnits.length };
  });

  return getCable(workspaceId, result.item.id);
}

export async function getCable(workspaceId: string, cableId: string) {
  const item = await prisma.inventoryItem.findFirst({
    where: {
      id: cableId,
      workspaceId,
      category: InventoryCategory.CABLE,
    },
    include: {
      cableSpec: {
        include: {
          endpoints: {
            include: {
              connector: true,
            },
            orderBy: { position: 'asc' },
          },
        },
      },
      units: {
        include: {
          storageLocation: {
            select: { id: true, name: true, type: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!item || !item.cableSpec) {
    throw new NotFoundError('Cable not found', 'CABLE_NOT_FOUND');
  }

  // Calculate dynamic availability summary
  const summary = {
    total: item.units.length,
    stored: item.units.filter((u) => u.status === UnitStatus.STORED).length,
    in_use: item.units.filter((u) => u.status === UnitStatus.IN_USE).length,
    loaned: item.units.filter((u) => u.status === UnitStatus.LOANED).length,
    missing: item.units.filter((u) => u.status === UnitStatus.MISSING).length,
    retired: item.units.filter((u) => u.status === UnitStatus.RETIRED).length,
  };

  const endpointA = item.cableSpec.endpoints.find((ep) => ep.position === 'A');
  const endpointB = item.cableSpec.endpoints.find((ep) => ep.position === 'B');

  return {
    id: item.id,
    workspaceId: item.workspaceId,
    name: item.name,
    description: item.description,
    connector_a: endpointA?.connectorName ?? '',
    connector_b: endpointB?.connectorName ?? '',
    connector_a_gender: endpointA?.gender ?? 'MALE',
    connector_b_gender: endpointB?.gender ?? 'MALE',
    color: item.cableSpec.color ?? '',
    length_cm: item.cableSpec.lengthCm,
    cable_standard: item.cableSpec.cableStandard,
    manufacturer: item.manufacturer,
    model: item.model,
    notes: item.cableSpec.notes ?? '',
    tags: item.tags,
    isArchived: item.isArchived,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    endpoints: item.cableSpec.endpoints,
    summary,
    units: item.units.map((u) => ({
      id: u.id,
      itemId: u.itemId,
      status: u.status,
      storageLocationId: u.storageLocationId,
      location_name: u.storageLocation?.name ?? null,
      usageLocation: u.usageLocation,
      usage_place: u.usageLocation ?? '',
      unitIdentifier: u.unitIdentifier,
      serialNumber: u.serialNumber,
      assetTag: u.assetTag,
      version: u.version,
      updatedAt: u.updatedAt,
    })),
  };
}

export async function updateCable(
  workspaceId: string,
  cableId: string,
  input: UpdateCableInput,
  actorUserId?: string
) {
  const existing = await prisma.inventoryItem.findFirst({
    where: { id: cableId, workspaceId, category: InventoryCategory.CABLE },
    include: { cableSpec: { include: { endpoints: true } } },
  });

  if (!existing || !existing.cableSpec) {
    throw new NotFoundError('Cable not found', 'CABLE_NOT_FOUND');
  }

  await prisma.$transaction(async (tx) => {
    await tx.inventoryItem.update({
      where: { id: cableId },
      data: {
        name: input.name,
        description: input.description,
        manufacturer: input.manufacturer,
        model: input.model,
        tags: input.tags,
      },
    });

    await tx.cableSpecification.update({
      where: { id: existing.cableSpec!.id },
      data: {
        color: input.color,
        lengthCm: input.lengthCm,
        cableStandard: input.cableStandard,
        notes: input.notes,
        specifications: input.specifications
          ? (input.specifications as Prisma.InputJsonValue)
          : undefined,
      },
    });

    if (input.connectorA) {
      const epA = existing.cableSpec!.endpoints.find((ep) => ep.position === 'A');
      if (epA) {
        await tx.cableEndpoint.update({
          where: { id: epA.id },
          data: {
            connectorName: input.connectorA,
            gender: input.connectorAGender,
          },
        });
      }
    }

    if (input.connectorB) {
      const epB = existing.cableSpec!.endpoints.find((ep) => ep.position === 'B');
      if (epB) {
        await tx.cableEndpoint.update({
          where: { id: epB.id },
          data: {
            connectorName: input.connectorB,
            gender: input.connectorBGender,
          },
        });
      }
    }

    await recordMovement(tx, {
      workspaceId,
      itemId: cableId,
      actorId: actorUserId,
      action: MovementAction.ITEM_UPDATED,
      previousState: existing as unknown as Prisma.InputJsonValue,
      reason: `Updated cable "${existing.name}"`,
    });
  });

  return getCable(workspaceId, cableId);
}

export async function archiveItem(
  workspaceId: string,
  itemId: string,
  actorUserId?: string
) {
  const item = await prisma.inventoryItem.findFirst({
    where: { id: itemId, workspaceId },
  });

  if (!item) {
    throw new NotFoundError('Inventory item not found');
  }

  await prisma.$transaction(async (tx) => {
    await tx.inventoryItem.update({
      where: { id: itemId },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    await recordMovement(tx, {
      workspaceId,
      itemId,
      actorId: actorUserId,
      action: MovementAction.ITEM_ARCHIVED,
      reason: `Archived inventory item "${item.name}"`,
    });
  });
}

// Universal Generic Item creation (Adapters, Electronics, Microcontrollers, Tools, etc.)
export async function createGenericItem(
  workspaceId: string,
  input: CreateGenericItemInput,
  actorUserId?: string
) {
  const item = await prisma.$transaction(async (tx) => {
    const created = await tx.inventoryItem.create({
      data: {
        workspaceId,
        name: input.name,
        description: input.description ?? null,
        category: input.category,
        itemType: input.itemType,
        manufacturer: input.manufacturer ?? null,
        model: input.model ?? null,
        sku: input.sku ?? null,
        internalReference: input.internalReference ?? null,
        tags: input.tags ?? [],
        metadata: input.metadata
          ? (input.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        createdById: actorUserId ?? null,
      },
    });

    await recordMovement(tx, {
      workspaceId,
      itemId: created.id,
      actorId: actorUserId,
      action: MovementAction.ITEM_CREATED,
      newState: created as unknown as Prisma.InputJsonValue,
      reason: `Created ${created.category} item "${created.name}"`,
    });

    return created;
  });

  return item;
}

export async function listItems(
  workspaceId: string,
  options: {
    category?: InventoryCategory;
    includeArchived?: boolean;
    search?: string;
  }
) {
  const where: Prisma.InventoryItemWhereInput = {
    workspaceId,
    isArchived: options.includeArchived ? undefined : false,
  };

  if (options.category) {
    where.category = options.category;
  }

  if (options.search) {
    where.OR = [
      { name: { contains: options.search, mode: 'insensitive' } },
      { description: { contains: options.search, mode: 'insensitive' } },
      { manufacturer: { contains: options.search, mode: 'insensitive' } },
      { model: { contains: options.search, mode: 'insensitive' } },
      { tags: { has: options.search } },
    ];
  }

  const items = await prisma.inventoryItem.findMany({
    where,
    include: {
      cableSpec: {
        include: {
          endpoints: true,
        },
      },
      _count: {
        select: { units: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return items;
}
