import { Role } from '@prisma/client';
import { prisma } from '../../database/client.js';
import { hashPassword, verifyPassword, generateSecureToken, hashToken } from '../../utils/crypto.js';
import { sendEmail } from '../../utils/mailer.js';
import { config } from '../../config/index.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../types/errors.js';
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
} from './schemas.js';

export interface AuthSessionResult {
  sessionToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    preferredLanguage: string;
    preferredTheme: string;
    timezone: string;
    emailVerified: boolean;
    createdAt: Date;
  };
  primaryWorkspaceId: string;
}

export async function registerUser(
  input: RegisterInput,
  ipAddress?: string,
  userAgent?: string
): Promise<AuthSessionResult> {
  // Check uniqueness of username and email
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: input.email.toLowerCase() },
        { username: input.username.toLowerCase() },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.email.toLowerCase() === input.email.toLowerCase()) {
      throw new ConflictError('Email is already registered', 'EMAIL_ALREADY_EXISTS');
    }
    throw new ConflictError('Username is already taken', 'USERNAME_ALREADY_EXISTS');
  }

  const passwordHash = await hashPassword(input.password);
  const sessionToken = generateSecureToken(32);
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date(Date.now() + config.SESSION_TTL_SECONDS * 1000);

  const workspaceName = input.workspaceName || `${input.displayName}'s Workspace`;
  const baseSlug = workspaceName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

  // Run user creation, workspace creation, member assignment, and session in a single transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        username: input.username,
        email: input.email.toLowerCase(),
        displayName: input.displayName,
        passwordHash,
        lastLoginAt: new Date(),
      },
    });

    const workspace = await tx.workspace.create({
      data: {
        name: workspaceName,
        slug,
        ownerId: user.id,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: Role.OWNER,
      },
    });

    await tx.session.create({
      data: {
        userId: user.id,
        tokenHash,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        expiresAt,
      },
    });

    return { user, workspace };
  });

  return {
    sessionToken,
    user: {
      id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      displayName: result.user.displayName,
      avatarUrl: result.user.avatarUrl,
      preferredLanguage: result.user.preferredLanguage,
      preferredTheme: result.user.preferredTheme,
      timezone: result.user.timezone,
      emailVerified: result.user.emailVerified,
      createdAt: result.user.createdAt,
    },
    primaryWorkspaceId: result.workspace.id,
  };
}

export async function loginUser(
  input: LoginInput,
  ipAddress?: string,
  userAgent?: string
): Promise<AuthSessionResult> {
  const loginLower = input.login.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: loginLower }, { username: { equals: input.login, mode: 'insensitive' } }],
    },
    include: {
      workspaceMemberships: {
        take: 1,
        orderBy: { joinedAt: 'asc' },
      },
    },
  });

  if (!user || !user.isActive) {
    // Avoid user enumeration
    throw new UnauthorizedError('Invalid login credentials', 'INVALID_CREDENTIALS');
  }

  const isValid = await verifyPassword(user.passwordHash, input.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid login credentials', 'INVALID_CREDENTIALS');
  }

  const sessionToken = generateSecureToken(32);
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date(Date.now() + config.SESSION_TTL_SECONDS * 1000);

  await prisma.$transaction([
    prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        expiresAt,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }),
  ]);

  const primaryWorkspaceId = user.workspaceMemberships[0]?.workspaceId || '';

  return {
    sessionToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      preferredLanguage: user.preferredLanguage,
      preferredTheme: user.preferredTheme,
      timezone: user.timezone,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
    primaryWorkspaceId,
  };
}

export async function logoutUser(sessionToken: string): Promise<void> {
  const tokenHash = hashToken(sessionToken);
  await prisma.session.deleteMany({
    where: { tokenHash },
  });
}

export async function logoutAllUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId },
  });
}

export async function changeUserPassword(
  userId: string,
  input: ChangePasswordInput,
  currentSessionToken?: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isValid = await verifyPassword(user.passwordHash, input.currentPassword);
  if (!isValid) {
    throw new BadRequestError('Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
  }

  const newHash = await hashPassword(input.newPassword);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Revoke all other sessions for security
    if (currentSessionToken) {
      const currentTokenHash = hashToken(currentSessionToken);
      await tx.session.deleteMany({
        where: {
          userId,
          tokenHash: { not: currentTokenHash },
        },
      });
    } else {
      await tx.session.deleteMany({ where: { userId } });
    }
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Always return generic success to prevent email enumeration
  if (!user || !user.isActive) {
    return;
  }

  const rawToken = generateSecureToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  await sendEmail(
    user.email,
    'AGF Drawer — Password Reset Request',
    `You requested a password reset. Use this token to reset your password within 1 hour:\n\n${rawToken}`
  );
}

export async function confirmPasswordReset(token: string, newPassword: string): Promise<void> {
  const tokenHash = hashToken(token);
  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
    throw new BadRequestError('Invalid or expired password reset token', 'INVALID_RESET_TOKEN');
  }

  const newHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: newHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
    // Invalidate all active sessions for this user
    prisma.session.deleteMany({
      where: { userId: resetRecord.userId },
    }),
  ]);
}

export async function requestEmailVerification(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.emailVerified) {
    return;
  }

  const rawToken = generateSecureToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000); // 24 hours

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  await sendEmail(
    user.email,
    'AGF Drawer — Verify your email',
    `Please verify your email address for AGF Drawer using this token:\n\n${rawToken}`
  );
}

export async function confirmEmailVerification(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  const verification = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!verification || verification.expiresAt < new Date()) {
    throw new BadRequestError('Invalid or expired verification token', 'INVALID_VERIFICATION_TOKEN');
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verification.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    }),
    prisma.emailVerificationToken.delete({
      where: { id: verification.id },
    }),
  ]);
}
