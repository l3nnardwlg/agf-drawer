import { FastifyReply, FastifyRequest } from 'fastify';
import { User, Workspace, WorkspaceMember, Role } from '@prisma/client';
import { prisma } from '../database/client.js';
import { hashToken } from '../utils/crypto.js';
import { ForbiddenError, UnauthorizedError } from '../types/errors.js';
import { hasPermission, Permission } from '../modules/permissions/index.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    sessionToken?: string;
    workspace?: Workspace;
    membership?: WorkspaceMember;
  }
}

export const SESSION_COOKIE_NAME = 'drawer_session';
export const CSRF_COOKIE_NAME = 'drawer_csrf';

export async function parseSession(request: FastifyRequest): Promise<void> {
  let token: string | undefined;

  // Check Authorization: Bearer <token>
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (request.cookies && request.cookies[SESSION_COOKIE_NAME]) {
    token = request.cookies[SESSION_COOKIE_NAME];
  }

  if (!token) {
    return;
  }

  const tokenHash = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || !session.user.isActive) {
    return;
  }

  request.user = session.user;
  request.sessionToken = token;

  // Asynchronously update lastActiveAt if older than 5 minutes
  if (Date.now() - session.lastActiveAt.getTime() > 300000) {
    prisma.session
      .update({
        where: { id: session.id },
        data: { lastActiveAt: new Date() },
      })
      .catch(() => {});
  }
}

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    throw new UnauthorizedError('Authentication required', 'UNAUTHORIZED');
  }

  // CSRF validation for cookie-authenticated mutating requests
  const isCookieAuth = !request.headers.authorization && Boolean(request.cookies[SESSION_COOKIE_NAME]);
  const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

  if (isCookieAuth && isMutating) {
    const csrfHeader = request.headers['x-csrf-token'];
    const csrfCookie = request.cookies[CSRF_COOKIE_NAME];
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      throw new ForbiddenError('Invalid or missing CSRF token', 'CSRF_VALIDATION_FAILED');
    }
  }
}

export async function resolveWorkspace(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    throw new UnauthorizedError('Authentication required', 'UNAUTHORIZED');
  }

  const params = request.params as Record<string, string> | undefined;
  const query = request.query as Record<string, string> | undefined;

  const workspaceId =
    (request.headers['x-workspace-id'] as string) ||
    params?.workspaceId ||
    query?.workspaceId;

  if (!workspaceId) {
    throw new ForbiddenError('Workspace ID context is required', 'WORKSPACE_ID_REQUIRED');
  }

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: request.user.id,
      },
    },
    include: {
      workspace: true,
    },
  });

  if (!membership || membership.workspace.isArchived) {
    throw new ForbiddenError('Access to this workspace is denied', 'WORKSPACE_ACCESS_DENIED');
  }

  request.membership = membership;
  request.workspace = membership.workspace;
}

export function requirePermission(permission: Permission) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.membership) {
      await resolveWorkspace(request, reply);
    }

    if (!request.membership || !hasPermission(request.membership.role, permission)) {
      throw new ForbiddenError(
        `Permission denied: '${permission}' is required`,
        'INSUFFICIENT_PERMISSIONS'
      );
    }
  };
}
