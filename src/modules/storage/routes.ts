import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { createLocationSchema, updateLocationSchema } from './schemas.js';
import * as storageService from './service.js';
import {
  requireAuth,
  requirePermission,
  resolveWorkspace,
} from '../../middleware/auth.js';

export const storageRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);
  app.addHook('preHandler', resolveWorkspace);

  // List locations
  app.get(
    '/',
    { preHandler: [requirePermission('inventory.read')] },
    async (request, reply) => {
      const { parentId } = request.query as { parentId?: string };
      const locations = await storageService.listLocations(
        request.workspace!.id,
        parentId
      );
      return reply.send(locations);
    }
  );

  // Get full location hierarchy tree
  app.get(
    '/tree',
    { preHandler: [requirePermission('inventory.read')] },
    async (request, reply) => {
      const tree = await storageService.getLocationTree(request.workspace!.id);
      return reply.send(tree);
    }
  );

  // Create location
  app.post(
    '/',
    { preHandler: [requirePermission('storage.manage')] },
    async (request, reply) => {
      const input = createLocationSchema.parse(request.body);
      const location = await storageService.createLocation(
        request.workspace!.id,
        input,
        request.user!.id
      );
      return reply.status(201).send(location);
    }
  );

  // Update location
  app.patch(
    '/:id',
    { preHandler: [requirePermission('storage.manage')] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const input = updateLocationSchema.parse(request.body);
      const updated = await storageService.updateLocation(
        request.workspace!.id,
        id,
        input,
        request.user!.id
      );
      return reply.send(updated);
    }
  );

  // Delete location
  app.delete(
    '/:id',
    { preHandler: [requirePermission('storage.manage')] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await storageService.deleteLocation(
        request.workspace!.id,
        id,
        request.user!.id
      );
      return reply.send({ message: 'Location deleted successfully' });
    }
  );
};
