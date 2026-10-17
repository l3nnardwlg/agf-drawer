import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { InventoryCategory, UnitStatus } from '@prisma/client';
import * as searchService from './service.js';
import {
  requireAuth,
  requirePermission,
  resolveWorkspace,
} from '../../middleware/auth.js';

export const searchRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);
  app.addHook('preHandler', resolveWorkspace);

  app.get(
    '/',
    { preHandler: [requirePermission('inventory.read')] },
    async (request, reply) => {
      const q = request.query as Record<string, string | undefined>;
      const results = await searchService.searchInventory(request.workspace!.id, {
        q: q.q,
        connectorA: q.connectorA || q.connector_a,
        connectorB: q.connectorB || q.connector_b,
        connector: q.connector,
        color: q.color,
        minLength: q.minLength || q.min_length ? parseInt(q.minLength || q.min_length!, 10) : undefined,
        maxLength: q.maxLength || q.max_length ? parseInt(q.maxLength || q.max_length!, 10) : undefined,
        manufacturer: q.manufacturer,
        category: q.category as InventoryCategory | undefined,
        locationId: q.locationId || q.location_id,
        usageLocation: q.usageLocation || q.usage_location,
        status: q.status as UnitStatus | undefined,
        tag: q.tag,
        sortBy: q.sortBy as 'name' | 'created_at' | 'length_cm' | undefined,
        sortOrder: q.sortOrder as 'asc' | 'desc' | undefined,
        page: q.page ? parseInt(q.page, 10) : 1,
        limit: q.limit ? parseInt(q.limit, 10) : 20,
      });

      return reply.send(results);
    }
  );
};
