import { UnitStatus } from '@prisma/client';
import { prisma } from '../../database/client.js';

export async function getWorkspaceStats(workspaceId: string) {
  const [
    totalItems,
    units,
    locationsCount,
    categoryCounts,
  ] = await Promise.all([
    prisma.inventoryItem.count({
      where: { workspaceId, isArchived: false },
    }),
    prisma.inventoryUnit.findMany({
      where: { workspaceId },
      select: {
        status: true,
        storageLocationId: true,
      },
    }),
    prisma.storageLocation.count({
      where: { workspaceId },
    }),
    prisma.inventoryItem.groupBy({
      by: ['category'],
      where: { workspaceId, isArchived: false },
      _count: { id: true },
    }),
  ]);

  const statusCounts = {
    total: units.length,
    stored: units.filter((u) => u.status === UnitStatus.STORED).length,
    in_use: units.filter((u) => u.status === UnitStatus.IN_USE).length,
    loaned: units.filter((u) => u.status === UnitStatus.LOANED).length,
    missing: units.filter((u) => u.status === UnitStatus.MISSING).length,
    retired: units.filter((u) => u.status === UnitStatus.RETIRED).length,
  };

  return {
    totalItems,
    locationsCount,
    units: statusCounts,
    categories: categoryCounts.map((c) => ({
      category: c.category,
      count: c._count.id,
    })),
  };
}
