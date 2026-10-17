import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  assignCableSchema,
  returnCableSchema,
  moveUsageLocationSchema,
} from './schemas.js';
import * as assignmentService from './service.js';
import {
  requireAuth,
  requirePermission,
  resolveWorkspace,
} from '../../middleware/auth.js';

export const assignmentRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);
  app.addHook('preHandler', resolveWorkspace);

  // List assignments
  app.get(
    '/',
    { preHandler: [requirePermission('inventory.read')] },
    async (request, reply) => {
      const { activeOnly, usageLocation } = request.query as {
        activeOnly?: string;
        usageLocation?: string;
      };
      const assignments = await assignmentService.listAssignments(
        request.workspace!.id,
        {
          activeOnly: activeOnly === 'true',
          usageLocation,
        }
      );
      return reply.send(assignments);
    }
  );

  // Assign cable
  app.post(
    '/assign',
    { preHandler: [requirePermission('inventory.move')] },
    async (request, reply) => {
      const input = assignCableSchema.parse(request.body);
      const result = await assignmentService.assignCable(
        request.workspace!.id,
        input,
        request.user!.id
      );
      return reply.status(201).send(result);
    }
  );

  // Return cable
  app.post(
    '/return',
    { preHandler: [requirePermission('inventory.move')] },
    async (request, reply) => {
      const input = returnCableSchema.parse(request.body);
      const unit = await assignmentService.returnCable(
        request.workspace!.id,
        input,
        request.user!.id
      );
      return reply.send(unit);
    }
  );

  // Move cable between usage locations
  app.post(
    '/move',
    { preHandler: [requirePermission('inventory.move')] },
    async (request, reply) => {
      const input = moveUsageLocationSchema.parse(request.body);
      const result = await assignmentService.moveCableUsageLocation(
        request.workspace!.id,
        input,
        request.user!.id
      );
      return reply.send(result);
    }
  );
};
