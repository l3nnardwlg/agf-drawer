import { MovementAction, Prisma } from '@prisma/client';
import { prisma, TransactionClient } from '../../database/client.js';

export interface RecordMovementInput {
  workspaceId: string;
  itemId?: string | null;
  unitId?: string | null;
  actorId?: string | null;
  action: MovementAction;
  previousState?: Prisma.InputJsonValue;
  newState?: Prisma.InputJsonValue;
  reason?: string | null;
}

export async function recordMovement(
  tx: TransactionClient,
  data: RecordMovementInput
) {
  return tx.inventoryMovement.create({
    data: {
      workspaceId: data.workspaceId,
      itemId: data.itemId ?? null,
      unitId: data.unitId ?? null,
      actorId: data.actorId ?? null,
      action: data.action,
      previousState: data.previousState ?? Prisma.JsonNull,
      newState: data.newState ?? Prisma.JsonNull,
      reason: data.reason ?? null,
    },
  });
}

export async function listMovements(
  workspaceId: string,
  options: {
    itemId?: string;
    unitId?: string;
    action?: MovementAction;
    limit?: number;
    offset?: number;
  }
) {
  const where: Prisma.InventoryMovementWhereInput = {
    workspaceId,
  };

  if (options.itemId) where.itemId = options.itemId;
  if (options.unitId) where.unitId = options.unitId;
  if (options.action) where.action = options.action;

  const [total, items] = await Promise.all([
    prisma.inventoryMovement.count({ where }),
    prisma.inventoryMovement.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: Math.min(options.limit ?? 50, 100),
      skip: options.offset ?? 0,
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        item: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        unit: {
          select: {
            id: true,
            unitIdentifier: true,
            status: true,
          },
        },
      },
    }),
  ]);

  return { total, items };
}
