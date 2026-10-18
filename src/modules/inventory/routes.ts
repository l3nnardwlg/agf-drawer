import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { InventoryCategory } from '@prisma/client';
import {
  createCableSchema,
  updateCableSchema,
  createGenericItemSchema,
  createUnitSchema,
} from './schemas.js';
import * as inventoryService from './service.js';
import * as unitService from '../units/service.js';
import {
  requireAuth,
  requirePermission,
  resolveWorkspace,
} from '../../middleware/auth.js';

export const inventoryRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);
  app.addHook('preHandler', resolveWorkspace);

  // List inventory items
  app.get(
    '/items',
    { preHandler: [requirePermission('inventory.read')] },
    async (request, reply) => {
      const { category, includeArchived, search } = request.query as {
        category?: InventoryCategory;
        includeArchived?: string;
        search?: string;
      };
      const items = await inventoryService.listItems(request.workspace!.id, {
        category,
        includeArchived: includeArchived === 'true',
        search,
      });
      return reply.send(items);
    }
  );

  // Create generic inventory item
  app.post(
    '/items',
    { preHandler: [requirePermission('inventory.create')] },
    async (request, reply) => {
      const input = createGenericItemSchema.parse(request.body);
      const item = await inventoryService.createGenericItem(
        request.workspace!.id,
        input,
        request.user!.id
      );
      return reply.status(201).send(item);
    }
  );

  // Archive inventory item
  app.post(
    '/items/:id/archive',
    { preHandler: [requirePermission('inventory.delete')] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await inventoryService.archiveItem(
        request.workspace!.id,
        id,
        request.user!.id
      );
      return reply.send({ message: 'Item archived successfully' });
    }
  );

  // Add physical unit to item
  app.post(
    '/items/:id/units',
    { preHandler: [requirePermission('inventory.create')] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const input = createUnitSchema.parse(request.body);
      const unit = await unitService.addUnit(
        request.workspace!.id,
        id,
        input,
        request.user!.id
      );
      return reply.status(201).send(unit);
    }
  );

  // CABLE SPECIFIC ROUTES
  // Create cable
  app.post(
    '/cables',
    { preHandler: [requirePermission('inventory.create')] },
    async (request, reply) => {
      const input = createCableSchema.parse(request.body);
      const cable = await inventoryService.createCable(
        request.workspace!.id,
        input,
        request.user!.id
      );
      return reply.status(201).send(cable);
    }
  );

  // Get cable details
  app.get(
    '/cables/:id',
    { preHandler: [requirePermission('inventory.read')] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const cable = await inventoryService.getCable(request.workspace!.id, id);
      return reply.send(cable);
    }
  );

  // Update cable
  app.patch(
    '/cables/:id',
    { preHandler: [requirePermission('inventory.update')] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const input = updateCableSchema.parse(request.body);
      const updated = await inventoryService.updateCable(
        request.workspace!.id,
        id,
        input,
        request.user!.id
      );
      return reply.send(updated);
    }
  );
};
