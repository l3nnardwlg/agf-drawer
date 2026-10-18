import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  updateProfileSchema,
  updatePreferencesSchema,
  deactivateAccountSchema,
} from './schemas.js';
import * as userService from './service.js';
import { requireAuth, SESSION_COOKIE_NAME, CSRF_COOKIE_NAME } from '../../middleware/auth.js';

export const userRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);

  // GET /api/v1/me
  app.get('/me', async (request, reply) => {
    const profile = await userService.getUserProfile(request.user!.id);
    return reply.send(profile);
  });

  // PATCH /api/v1/me
  app.patch('/me', async (request, reply) => {
    const input = updateProfileSchema.parse(request.body);
    const updated = await userService.updateUserProfile(request.user!.id, input);
    return reply.send(updated);
  });

  // PATCH /api/v1/me/preferences
  app.patch('/me/preferences', async (request, reply) => {
    const input = updatePreferencesSchema.parse(request.body);
    const updated = await userService.updateUserPreferences(request.user!.id, input);
    return reply.send(updated);
  });

  // GET /api/v1/me/sessions
  app.get('/me/sessions', async (request, reply) => {
    const sessions = await userService.listUserSessions(request.user!.id, request.sessionToken);
    return reply.send(sessions);
  });

  // DELETE /api/v1/me/sessions/:id
  app.delete('/me/sessions/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await userService.revokeUserSession(request.user!.id, id);
    return reply.send({ message: 'Session revoked successfully' });
  });

  // POST /api/v1/me/deactivate
  app.post('/me/deactivate', async (request, reply) => {
    const input = deactivateAccountSchema.parse(request.body);
    await userService.deactivateAccount(request.user!.id, input);
    reply.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    reply.clearCookie(CSRF_COOKIE_NAME, { path: '/' });
    return reply.send({ message: 'Account deactivated successfully' });
  });
};
