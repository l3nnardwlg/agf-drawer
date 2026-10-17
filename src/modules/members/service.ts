import { Role } from '@prisma/client';
import { prisma } from '../../database/client.js';
import { generateSecureToken, hashToken } from '../../utils/crypto.js';
import { sendEmail } from '../../utils/mailer.js';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../types/errors.js';
import { roleLevel } from '../permissions/index.js';

export async function listMembers(workspaceId: string) {
  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          lastLoginAt: true,
        },
      },
    },
    orderBy: { joinedAt: 'asc' },
  });

  return members.map((m) => ({
    id: m.id,
    userId: m.user.id,
    username: m.user.username,
    email: m.user.email,
    displayName: m.user.displayName,
    avatarUrl: m.user.avatarUrl,
    role: m.role,
    joinedAt: m.joinedAt,
  }));
}

export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  newRole: Role,
  actorUserId: string
) {
  const [actorMember, targetMember] = await Promise.all([
    prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: actorUserId,
        },
      },
    }),
    prisma.workspaceMember.findUnique({
      where: { id: memberId },
    }),
  ]);

  if (!actorMember) {
    throw new ForbiddenError('Actor is not a workspace member');
  }

  if (!targetMember || targetMember.workspaceId !== workspaceId) {
    throw new NotFoundError('Member not found');
  }

  if (targetMember.role === Role.OWNER) {
    throw new ForbiddenError('Cannot change the role of the workspace owner', 'CANNOT_MODIFY_OWNER');
  }

  // Privilege escalation check: Actor can only assign roles strictly lower than their own, unless OWNER
  if (actorMember.role !== Role.OWNER) {
    if (roleLevel(newRole) >= roleLevel(actorMember.role)) {
      throw new ForbiddenError('Cannot assign a role equal to or higher than your own', 'PRIVILEGE_ESCALATION');
    }
    if (roleLevel(targetMember.role) >= roleLevel(actorMember.role)) {
      throw new ForbiddenError('Cannot modify a member with equal or higher role', 'PRIVILEGE_ESCALATION');
    }
  }

  const updated = await prisma.workspaceMember.update({
    where: { id: memberId },
    data: { role: newRole },
  });

  return updated;
}

export async function removeMember(
  workspaceId: string,
  memberId: string,
  actorUserId: string
) {
  const [actorMember, targetMember] = await Promise.all([
    prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: actorUserId,
        },
      },
    }),
    prisma.workspaceMember.findUnique({
      where: { id: memberId },
    }),
  ]);

  if (!actorMember) {
    throw new ForbiddenError('Actor is not a workspace member');
  }

  if (!targetMember || targetMember.workspaceId !== workspaceId) {
    throw new NotFoundError('Member not found');
  }

  if (targetMember.role === Role.OWNER) {
    throw new ForbiddenError('Cannot remove the workspace owner', 'CANNOT_REMOVE_OWNER');
  }

  if (actorMember.role !== Role.OWNER && roleLevel(targetMember.role) >= roleLevel(actorMember.role)) {
    throw new ForbiddenError('Cannot remove a member with equal or higher role', 'PRIVILEGE_ESCALATION');
  }

  await prisma.workspaceMember.delete({
    where: { id: memberId },
  });
}

export async function leaveWorkspace(workspaceId: string, userId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!member) {
    throw new NotFoundError('Membership not found');
  }

  if (member.role === Role.OWNER) {
    const otherOwners = await prisma.workspaceMember.count({
      where: {
        workspaceId,
        role: Role.OWNER,
        userId: { not: userId },
      },
    });

    if (otherOwners === 0) {
      throw new BadRequestError(
        'The last owner cannot leave the workspace without transferring ownership',
        'LAST_OWNER_CANNOT_LEAVE'
      );
    }
  }

  await prisma.workspaceMember.delete({
    where: { id: member.id },
  });
}

export async function transferOwnership(
  workspaceId: string,
  currentOwnerUserId: string,
  newOwnerUserId: string
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== currentOwnerUserId) {
    throw new ForbiddenError('Only the current workspace owner can transfer ownership', 'NOT_WORKSPACE_OWNER');
  }

  const newOwnerMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: newOwnerUserId,
      },
    },
  });

  if (!newOwnerMember) {
    throw new NotFoundError('The new owner must already be a member of the workspace', 'USER_NOT_MEMBER');
  }

  await prisma.$transaction([
    prisma.workspace.update({
      where: { id: workspaceId },
      data: { ownerId: newOwnerUserId },
    }),
    prisma.workspaceMember.update({
      where: { id: newOwnerMember.id },
      data: { role: Role.OWNER },
    }),
    prisma.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: currentOwnerUserId,
        },
      },
      data: { role: Role.ADMIN },
    }),
  ]);
}

export async function createInvitation(
  workspaceId: string,
  email: string,
  role: Role,
  invitedByUserId: string
) {
  const emailLower = email.toLowerCase();

  // Check if already a member
  const existingMember = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      user: { email: emailLower },
    },
  });

  if (existingMember) {
    throw new ConflictError('User is already a member of this workspace', 'ALREADY_MEMBER');
  }

  const rawToken = generateSecureToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days

  // Check pending invitations and revoke older ones
  await prisma.workspaceInvitation.updateMany({
    where: {
      workspaceId,
      email: emailLower,
      acceptedAt: null,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  });

  const invitation = await prisma.workspaceInvitation.create({
    data: {
      workspaceId,
      email: emailLower,
      role,
      tokenHash,
      invitedById: invitedByUserId,
      expiresAt,
    },
    include: {
      workspace: true,
      invitedBy: true,
    },
  });

  await sendEmail(
    emailLower,
    `Invitation to join ${invitation.workspace.name} on AGF Drawer`,
    `You have been invited by ${invitation.invitedBy.displayName} to join the workspace "${invitation.workspace.name}" as ${role}.\n\nInvitation Token:\n${rawToken}`
  );

  return {
    id: invitation.id,
    email: invitation.email,
    role: invitation.role,
    expiresAt: invitation.expiresAt,
    invitationToken: rawToken, // For convenience in development/testing
  };
}

export async function listInvitations(workspaceId: string) {
  const invitations = await prisma.workspaceInvitation.findMany({
    where: {
      workspaceId,
      acceptedAt: null,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      invitedBy: {
        select: {
          id: true,
          username: true,
          displayName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return invitations.map((inv) => ({
    id: inv.id,
    email: inv.email,
    role: inv.role,
    expiresAt: inv.expiresAt,
    createdAt: inv.createdAt,
    invitedBy: inv.invitedBy,
  }));
}

export async function revokeInvitation(workspaceId: string, invitationId: string) {
  const invitation = await prisma.workspaceInvitation.findFirst({
    where: { id: invitationId, workspaceId },
  });

  if (!invitation) {
    throw new NotFoundError('Invitation not found');
  }

  await prisma.workspaceInvitation.update({
    where: { id: invitationId },
    data: { revokedAt: new Date() },
  });
}

export async function acceptInvitation(rawToken: string, userId: string) {
  const tokenHash = hashToken(rawToken);
  const invitation = await prisma.workspaceInvitation.findUnique({
    where: { tokenHash },
    include: { workspace: true },
  });

  if (
    !invitation ||
    invitation.acceptedAt ||
    invitation.revokedAt ||
    invitation.expiresAt < new Date()
  ) {
    throw new BadRequestError('Invalid or expired invitation token', 'INVALID_INVITATION');
  }

  const existingMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: invitation.workspaceId,
        userId,
      },
    },
  });

  if (existingMember) {
    throw new ConflictError('You are already a member of this workspace', 'ALREADY_MEMBER');
  }

  await prisma.$transaction([
    prisma.workspaceMember.create({
      data: {
        workspaceId: invitation.workspaceId,
        userId,
        role: invitation.role,
      },
    }),
    prisma.workspaceInvitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    }),
  ]);

  return {
    workspaceId: invitation.workspace.id,
    workspaceName: invitation.workspace.name,
    role: invitation.role,
  };
}
