import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as statsService from './service.js';
import {
  requireAuth,
  requirePermission,
  resolveWorkspace,
} from '../../middleware/auth.js';

export const statsRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);
  app.addHook('preHandler', resolveWorkspace);

  app.get(
    '/',
    { preHandler: [requirePermission('inventory.read')] },
    async (request, reply) => {
      const stats = await statsService.getWorkspaceStats(request.workspace!.id);
      return reply.send(stats);
    }
  );
};
