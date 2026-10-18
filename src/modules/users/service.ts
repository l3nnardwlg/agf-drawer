import { prisma } from '../../database/client.js';
import { verifyPassword } from '../../utils/crypto.js';
import { BadRequestError, NotFoundError } from '../../types/errors.js';
import {
  UpdateProfileInput,
  UpdatePreferencesInput,
  DeactivateAccountInput,
} from './schemas.js';

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workspaceMemberships: {
        include: {
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
              isArchived: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    preferredLanguage: user.preferredLanguage,
    preferredTheme: user.preferredTheme,
    timezone: user.timezone,
    emailVerified: user.emailVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    workspaces: user.workspaceMemberships
      .filter((m) => !m.workspace.isArchived)
      .map((m) => ({
        workspaceId: m.workspace.id,
        name: m.workspace.name,
        slug: m.workspace.slug,
        icon: m.workspace.icon,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
  };
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: input.displayName,
      avatarUrl: input.avatarUrl,
    },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      preferredLanguage: true,
      preferredTheme: true,
      timezone: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function updateUserPreferences(userId: string, input: UpdatePreferencesInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      preferredLanguage: input.preferredLanguage,
      preferredTheme: input.preferredTheme,
      timezone: input.timezone,
    },
    select: {
      id: true,
      preferredLanguage: true,
      preferredTheme: true,
      timezone: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function listUserSessions(userId: string, currentSessionToken?: string) {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
    orderBy: { lastActiveAt: 'desc' },
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      lastActiveAt: true,
      expiresAt: true,
      tokenHash: true,
    },
  });

  return sessions.map((s) => ({
    id: s.id,
    ipAddress: s.ipAddress,
    userAgent: s.userAgent,
    createdAt: s.createdAt,
    lastActiveAt: s.lastActiveAt,
    expiresAt: s.expiresAt,
  }));
}

export async function revokeUserSession(userId: string, sessionId: string) {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    throw new NotFoundError('Session not found');
  }

  await prisma.session.delete({
    where: { id: sessionId },
  });
}

export async function deactivateAccount(userId: string, input: DeactivateAccountInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isValid = await verifyPassword(user.passwordHash, input.password);
  if (!isValid) {
    throw new BadRequestError('Password confirmation failed', 'INVALID_PASSWORD');
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    }),
    prisma.session.deleteMany({
      where: { userId },
    }),
  ]);
}
