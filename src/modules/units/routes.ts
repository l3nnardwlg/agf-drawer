import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { UnitStatus } from '@prisma/client';
import { updateUnitSchema } from '../inventory/schemas.js';
import * as unitService from './service.js';
import {
  requireAuth,
  requirePermission,
  resolveWorkspace,
} from '../../middleware/auth.js';

export const unitRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);
  app.addHook('preHandler', resolveWorkspace);

  // List units
  app.get(
    '/',
    { preHandler: [requirePermission('inventory.read')] },
    async (request, reply) => {
      const { itemId, status, locationId } = request.query as {
        itemId?: string;
        status?: UnitStatus;
        locationId?: string;
      };
      const units = await unitService.listUnits(request.workspace!.id, {
        itemId,
        status,
        locationId,
      });
      return reply.send(units);
    }
  );

  // Get single unit
  app.get(
    '/:id',
    { preHandler: [requirePermission('inventory.read')] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const unit = await unitService.getUnit(request.workspace!.id, id);
      return reply.send(unit);
    }
  );

  // Update physical unit (status, location, notes, optimistic lock)
  app.patch(
    '/:id',
    { preHandler: [requirePermission('inventory.move')] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const input = updateUnitSchema.parse(request.body);
      const updated = await unitService.updateUnit(
        request.workspace!.id,
        id,
        input,
        request.user!.id
      );
      return reply.send(updated);
    }
  );
};
