import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { MovementAction } from '@prisma/client';
import * as movementService from './index.js';
import {
  requireAuth,
  requirePermission,
  resolveWorkspace,
} from '../../middleware/auth.js';

export const movementRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);
  app.addHook('preHandler', resolveWorkspace);

  // List movements / audit trail
  app.get(
    '/',
    { preHandler: [requirePermission('audit.read')] },
    async (request, reply) => {
      const { itemId, unitId, action, limit, offset } = request.query as {
        itemId?: string;
        unitId?: string;
        action?: MovementAction;
        limit?: string;
        offset?: string;
      };

      const result = await movementService.listMovements(
        request.workspace!.id,
        {
          itemId,
          unitId,
          action,
          limit: limit ? parseInt(limit, 10) : 50,
          offset: offset ? parseInt(offset, 10) : 0,
        }
      );

      return reply.send(result);
    }
  );
};
