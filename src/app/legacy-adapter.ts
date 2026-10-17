import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { LocationType, Role, UnitStatus } from '@prisma/client';
import { prisma } from '../database/client.js';
import * as inventoryService from '../modules/inventory/service.js';
import * as unitService from '../modules/units/service.js';
import * as storageService from '../modules/storage/service.js';
import * as searchService from '../modules/search/service.js';

let cachedDefaultWorkspaceId: string | null = null;

async function getOrCreateDefaultWorkspaceId(): Promise<string> {
  if (cachedDefaultWorkspaceId) {
    return cachedDefaultWorkspaceId;
  }

  // Find any existing workspace or create a default system workspace
  const existing = await prisma.workspace.findFirst({
    where: { isArchived: false },
    orderBy: { createdAt: 'asc' },
  });

  if (existing) {
    cachedDefaultWorkspaceId = existing.id;
    return existing.id;
  }

  // Create default system user and workspace
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@agf-studios.local' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@agf-studios.local',
      displayName: 'System Admin',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhashfordefaultworkspaceadminuser',
    },
  });

  const ws = await prisma.workspace.create({
    data: {
      name: 'Default Workspace',
      slug: 'default-workspace',
      ownerId: defaultUser.id,
      members: {
        create: {
          userId: defaultUser.id,
          role: Role.OWNER,
        },
      },
    },
  });

  cachedDefaultWorkspaceId = ws.id;
  return ws.id;
}

export const legacyAdapterRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // GET /api/locations
  app.get('/locations', async (request, reply) => {
    const wsId = request.workspace?.id ?? (await getOrCreateDefaultWorkspaceId());
    const locations = await storageService.listLocations(wsId);
    return reply.send(
      locations.map((l) => ({
        id: l.id,
        name: l.name,
        parent_id: l.parentId,
        kind: l.type.toLowerCase(),
      }))
    );
  });

  // POST /api/locations
  app.post('/locations', async (request, reply) => {
    const wsId = request.workspace?.id ?? (await getOrCreateDefaultWorkspaceId());
    const body = request.body as { name: string; kind: string; parent_id?: string | null };

    const kindMap: Record<string, LocationType> = {
      cabinet: LocationType.CABINET,
      drawer: LocationType.DRAWER,
      shelf: LocationType.SHELF,
      box: LocationType.BOX,
      other: LocationType.OTHER,
    };

    const type = kindMap[body.kind.toLowerCase()] || LocationType.OTHER;

    const loc = await storageService.createLocation(
      wsId,
      {
        name: body.name,
        type,
        parentId: body.parent_id ?? null,
        sortOrder: 0,
      },
      request.user?.id
    );

    return reply.status(201).send({ id: loc.id });
  });

  // GET /api/cables
  app.get('/cables', async (request, reply) => {
    const wsId = request.workspace?.id ?? (await getOrCreateDefaultWorkspaceId());
    const query = request.query as { q?: string; status?: string };

    const statusMap: Record<string, UnitStatus> = {
      stored: UnitStatus.STORED,
      in_use: UnitStatus.IN_USE,
      loaned: UnitStatus.LOANED,
      missing: UnitStatus.MISSING,
    };

    const results = await searchService.searchInventory(wsId, {
      q: query.q,
      status: query.status ? statusMap[query.status.toLowerCase()] : undefined,
      limit: 100,
    });

    return reply.send(results.items);
  });

  // GET /api/cables/:id
  app.get('/cables/:id', async (request, reply) => {
    const wsId = request.workspace?.id ?? (await getOrCreateDefaultWorkspaceId());
    const { id } = request.params as { id: string };
    const cable = await inventoryService.getCable(wsId, id);
    return reply.send(cable);
  });

  // POST /api/cables
  app.post('/cables', async (request, reply) => {
    const wsId = request.workspace?.id ?? (await getOrCreateDefaultWorkspaceId());
    const body = request.body as {
      name: string;
      connector_a: string;
      connector_b: string;
      color?: string;
      length_cm?: number | null;
      notes?: string;
      quantity?: number;
      location_id?: string | null;
      status?: string;
      usage_place?: string;
    };

    const statusMap: Record<string, UnitStatus> = {
      stored: UnitStatus.STORED,
      in_use: UnitStatus.IN_USE,
      loaned: UnitStatus.LOANED,
      missing: UnitStatus.MISSING,
    };

    const cable = await inventoryService.createCable(
      wsId,
      {
        name: body.name,
        connectorA: body.connector_a,
        connectorB: body.connector_b,
        connectorAGender: 'MALE',
        connectorBGender: 'MALE',
        color: body.color,
        lengthCm: body.length_cm,
        notes: body.notes,
        tags: [],
        quantity: body.quantity ?? 1,
        locationId: body.location_id,
        status: body.status ? statusMap[body.status.toLowerCase()] ?? UnitStatus.STORED : UnitStatus.STORED,
        usageLocation: body.usage_place,
      },
      request.user?.id
    );

    return reply.status(201).send({ id: cable.id });
  });

  // PATCH /api/units/:id
  app.patch('/units/:id', async (request, reply) => {
    const wsId = request.workspace?.id ?? (await getOrCreateDefaultWorkspaceId());
    const { id } = request.params as { id: string };
    const body = request.body as {
      status?: string;
      location_id?: string | null;
      usage_place?: string | null;
    };

    const statusMap: Record<string, UnitStatus> = {
      stored: UnitStatus.STORED,
      in_use: UnitStatus.IN_USE,
      loaned: UnitStatus.LOANED,
      missing: UnitStatus.MISSING,
    };

    await unitService.updateUnit(
      wsId,
      id,
      {
        status: body.status ? statusMap[body.status.toLowerCase()] : undefined,
        storageLocationId: body.location_id,
        usageLocation: body.usage_place,
      },
      request.user?.id
    );

    return reply.send({ ok: true });
  });

  // POST /api/cables/:id/units
  app.post('/cables/:id/units', async (request, reply) => {
    const wsId = request.workspace?.id ?? (await getOrCreateDefaultWorkspaceId());
    const { id } = request.params as { id: string };
    const body = request.body as { location_id?: string | null };

    const unit = await unitService.addUnit(
      wsId,
      id,
      {
        status: UnitStatus.STORED,
        storageLocationId: body.location_id ?? null,
      },
      request.user?.id
    );

    return reply.status(201).send({ id: unit.id });
  });
};
