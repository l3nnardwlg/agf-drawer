import {
  InventoryCategory,
  UnitStatus,
  Prisma,
} from '@prisma/client';
import { prisma } from '../../database/client.js';

export interface SearchCablesQuery {
  q?: string;
  connectorA?: string;
  connectorB?: string;
  connector?: string;
  color?: string;
  minLength?: number;
  maxLength?: number;
  manufacturer?: string;
  category?: InventoryCategory;
  locationId?: string;
  usageLocation?: string;
  status?: UnitStatus;
  tag?: string;
  sortBy?: 'name' | 'created_at' | 'length_cm';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function searchInventory(
  workspaceId: string,
  query: SearchCablesQuery
) {
  const page = Math.max(query.page ?? 1, 1);
  const limit = Math.min(Math.max(query.limit ?? 20, 1), 100);
  const skip = (page - 1) * limit;

  // Resolve connector aliases if provided
  let connFilterA = query.connectorA?.trim();
  let connFilterB = query.connectorB?.trim();
  let connFilterSingle = query.connector?.trim();

  // If general query string `q` is given and looks like connector search or name search
  const qLower = query.q?.trim().toLowerCase();

  // Build Prisma where conditions
  const where: Prisma.InventoryItemWhereInput = {
    workspaceId,
    isArchived: false,
  };

  if (query.category) {
    where.category = query.category;
  }

  const andConditions: Prisma.InventoryItemWhereInput[] = [];

  // General text search
  if (qLower) {
    andConditions.push({
      OR: [
        { name: { contains: qLower, mode: 'insensitive' } },
        { description: { contains: qLower, mode: 'insensitive' } },
        { manufacturer: { contains: qLower, mode: 'insensitive' } },
        { model: { contains: qLower, mode: 'insensitive' } },
        { tags: { has: qLower } },
        {
          cableSpec: {
            OR: [
              { color: { contains: qLower, mode: 'insensitive' } },
              { notes: { contains: qLower, mode: 'insensitive' } },
              {
                endpoints: {
                  some: {
                    connectorName: { contains: qLower, mode: 'insensitive' },
                  },
                },
              },
            ],
          },
        },
      ],
    });
  }

  // Manufacturer filter
  if (query.manufacturer) {
    andConditions.push({
      manufacturer: { contains: query.manufacturer, mode: 'insensitive' },
    });
  }

  // Tag filter
  if (query.tag) {
    andConditions.push({
      tags: { has: query.tag },
    });
  }

  // Storage location or usage location or status filter on units
  if (query.locationId || query.usageLocation || query.status) {
    const unitCondition: Prisma.InventoryUnitWhereInput = {};
    if (query.locationId) unitCondition.storageLocationId = query.locationId;
    if (query.usageLocation) {
      unitCondition.usageLocation = { contains: query.usageLocation, mode: 'insensitive' };
    }
    if (query.status) unitCondition.status = query.status;

    andConditions.push({
      units: { some: unitCondition },
    });
  }

  // Cable-specific filters (color, length, symmetrical connector matching)
  const cableSpecCondition: Prisma.CableSpecificationWhereInput = {};

  if (query.color) {
    cableSpecCondition.color = { contains: query.color, mode: 'insensitive' };
  }

  if (query.minLength !== undefined || query.maxLength !== undefined) {
    cableSpecCondition.lengthCm = {};
    if (query.minLength !== undefined) cableSpecCondition.lengthCm.gte = query.minLength;
    if (query.maxLength !== undefined) cableSpecCondition.lengthCm.lte = query.maxLength;
  }

  // Single connector query
  if (connFilterSingle) {
    cableSpecCondition.endpoints = {
      some: {
        connectorName: { equals: connFilterSingle, mode: 'insensitive' },
      },
    };
  }

  // Symmetrical connector combination search (A and B in either direction!)
  if (connFilterA && connFilterB) {
    // Must have an endpoint matching A AND an endpoint matching B
    cableSpecCondition.AND = [
      {
        endpoints: {
          some: {
            connectorName: { equals: connFilterA, mode: 'insensitive' },
          },
        },
      },
      {
        endpoints: {
          some: {
            connectorName: { equals: connFilterB, mode: 'insensitive' },
          },
        },
      },
    ];
  } else if (connFilterA) {
    cableSpecCondition.endpoints = {
      some: {
        connectorName: { equals: connFilterA, mode: 'insensitive' },
      },
    };
  } else if (connFilterB) {
    cableSpecCondition.endpoints = {
      some: {
        connectorName: { equals: connFilterB, mode: 'insensitive' },
      },
    };
  }

  if (Object.keys(cableSpecCondition).length > 0) {
    andConditions.push({
      cableSpec: cableSpecCondition,
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // Sorting
  let orderBy: Prisma.InventoryItemOrderByWithRelationInput = { createdAt: 'desc' };
  if (query.sortBy === 'name') {
    orderBy = { name: query.sortOrder ?? 'asc' };
  } else if (query.sortBy === 'created_at') {
    orderBy = { createdAt: query.sortOrder ?? 'desc' };
  } else if (query.sortBy === 'length_cm') {
    orderBy = { cableSpec: { lengthCm: query.sortOrder ?? 'asc' } };
  }

  const [total, items] = await Promise.all([
    prisma.inventoryItem.count({ where }),
    prisma.inventoryItem.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        cableSpec: {
          include: {
            endpoints: true,
          },
        },
        units: {
          include: {
            storageLocation: {
              select: { id: true, name: true, type: true },
            },
          },
        },
      },
    }),
  ]);

  const mapped = items.map((item) => {
    const endpointA = item.cableSpec?.endpoints.find((ep) => ep.position === 'A');
    const endpointB = item.cableSpec?.endpoints.find((ep) => ep.position === 'B');

    const totalUnits = item.units.length;
    const storedUnits = item.units.filter((u) => u.status === UnitStatus.STORED).length;
    const inUseUnits = item.units.filter((u) => u.status === UnitStatus.IN_USE).length;
    const loanedUnits = item.units.filter((u) => u.status === UnitStatus.LOANED).length;
    const missingUnits = item.units.filter((u) => u.status === UnitStatus.MISSING).length;

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      itemType: item.itemType,
      manufacturer: item.manufacturer,
      model: item.model,
      connector_a: endpointA?.connectorName ?? '',
      connector_b: endpointB?.connectorName ?? '',
      color: item.cableSpec?.color ?? '',
      length_cm: item.cableSpec?.lengthCm ?? null,
      cable_standard: item.cableSpec?.cableStandard ?? null,
      notes: item.cableSpec?.notes ?? item.description ?? '',
      tags: item.tags,
      total: totalUnits,
      stored: storedUnits,
      in_use: inUseUnits,
      loaned: loanedUnits,
      missing: missingUnits,
      units: item.units,
      createdAt: item.createdAt,
    };
  });

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    items: mapped,
  };
}
