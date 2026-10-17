import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ConnectorFamily } from '@prisma/client';
import { createConnectorSchema } from './schemas.js';
import * as connectorService from './service.js';
import {
  requireAuth,
  requirePermission,
  resolveWorkspace,
} from '../../middleware/auth.js';

export const connectorRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);

  // List connectors (optionally filtered by family or workspace)
  app.get('/', async (request, reply) => {
    const { family, workspaceId } = request.query as {
      family?: ConnectorFamily;
      workspaceId?: string;
    };
    const wsId = workspaceId || (request.headers['x-workspace-id'] as string | undefined);
    const connectors = await connectorService.listConnectors(wsId, family);
    return reply.send(connectors);
  });

  // Create custom connector for workspace
  app.post(
    '/',
    { preHandler: [resolveWorkspace, requirePermission('inventory.create')] },
    async (request, reply) => {
      const input = createConnectorSchema.parse(request.body);
      const connector = await connectorService.createCustomConnector(
        request.workspace!.id,
        input
      );
      return reply.status(201).send(connector);
    }
  );
};
