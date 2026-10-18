import { ConnectorFamily, Prisma } from '@prisma/client';
import { prisma } from '../../database/client.js';
import { ConflictError } from '../../types/errors.js';
import { CreateConnectorInput } from './schemas.js';

export async function listConnectors(
  workspaceId?: string,
  family?: ConnectorFamily
) {
  const where: Prisma.ConnectorWhereInput = {
    OR: [
      { workspaceId: null },
      ...(workspaceId ? [{ workspaceId }] : []),
    ],
  };

  if (family) {
    where.family = family;
  }

  const connectors = await prisma.connector.findMany({
    where,
    orderBy: [{ isCustom: 'asc' }, { family: 'asc' }, { name: 'asc' }],
  });

  return connectors;
}

export async function createCustomConnector(
  workspaceId: string,
  input: CreateConnectorInput
) {
  // Check if already exists in workspace or global
  const existing = await prisma.connector.findFirst({
    where: {
      OR: [{ workspaceId: null }, { workspaceId }],
      name: { equals: input.name, mode: 'insensitive' },
    },
  });

  if (existing) {
    throw new ConflictError(
      `Connector with name "${input.name}" already exists`,
      'CONNECTOR_ALREADY_EXISTS'
    );
  }

  const connector = await prisma.connector.create({
    data: {
      workspaceId,
      name: input.name,
      family: input.family,
      gender: input.gender,
      description: input.description,
      aliases: input.aliases,
      protocols: input.protocols,
      isCustom: true,
    },
  });

  return connector;
}
