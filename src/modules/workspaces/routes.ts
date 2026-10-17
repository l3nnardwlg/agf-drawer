import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { createWorkspaceSchema, updateWorkspaceSchema } from './schemas.js';
import * as workspaceService from './service.js';
import { requireAuth, requirePermission, resolveWorkspace } from '../../middleware/auth.js';

export const workspaceRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);

  // List user's workspaces
  app.get('/', async (request, reply) => {
    const workspaces = await workspaceService.listUserWorkspaces(request.user!.id);
    return reply.send(workspaces);
  });

  // Create new workspace
  app.post('/', async (request, reply) => {
    const input = createWorkspaceSchema.parse(request.body);
    const workspace = await workspaceService.createWorkspace(request.user!.id, input);
    return reply.status(201).send(workspace);
  });

  // Get single workspace
  app.get(
    '/:workspaceId',
    { preHandler: [resolveWorkspace, requirePermission('workspace.read')] },
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      const workspace = await workspaceService.getWorkspace(workspaceId, request.user!.id);
      return reply.send(workspace);
    }
  );

  // Update workspace
  app.patch(
    '/:workspaceId',
    { preHandler: [resolveWorkspace, requirePermission('workspace.update')] },
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      const input = updateWorkspaceSchema.parse(request.body);
      const updated = await workspaceService.updateWorkspace(
        workspaceId,
        request.user!.id,
        input
      );
      return reply.send(updated);
    }
  );

  // Archive workspace
  app.post(
    '/:workspaceId/archive',
    { preHandler: [resolveWorkspace, requirePermission('workspace.update')] },
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      await workspaceService.archiveWorkspace(workspaceId, request.user!.id);
      return reply.send({ message: 'Workspace archived successfully' });
    }
  );

  // Delete workspace
  app.delete(
    '/:workspaceId',
    { preHandler: [resolveWorkspace, requirePermission('workspace.delete')] },
    async (request, reply) => {
      const { workspaceId } = request.params as { workspaceId: string };
      await workspaceService.deleteWorkspace(workspaceId, request.user!.id);
      return reply.send({ message: 'Workspace deleted successfully' });
    }
  );
};
