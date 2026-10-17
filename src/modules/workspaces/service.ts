import { Role, Prisma } from '@prisma/client';
import { prisma } from '../../database/client.js';
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../types/errors.js';
import { CreateWorkspaceInput, UpdateWorkspaceInput } from './schemas.js';

export async function createWorkspace(userId: string, input: CreateWorkspaceInput) {
  let slug = input.slug;
  if (!slug) {
    const baseSlug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
  }

  const existingSlug = await prisma.workspace.findUnique({
    where: { slug },
  });

  if (existingSlug) {
    throw new ConflictError('A workspace with this slug already exists', 'WORKSPACE_SLUG_EXISTS');
  }

  const workspace = await prisma.$transaction(async (tx) => {
    const ws = await tx.workspace.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        icon: input.icon,
        ownerId: userId,
        settings: input.settings ? (input.settings as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: ws.id,
        userId,
        role: Role.OWNER,
      },
    });

    return ws;
  });

  return workspace;
}

export async function listUserWorkspaces(userId: string) {
  const memberships = await prisma.workspaceMember.findMany({
    where: {
      userId,
      workspace: { isArchived: false },
    },
    include: {
      workspace: true,
    },
    orderBy: { joinedAt: 'asc' },
  });

  return memberships.map((m) => ({
    ...m.workspace,
    currentUserRole: m.role,
  }));
}

export async function getWorkspace(workspaceId: string, userId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
    include: {
      workspace: {
        include: {
          _count: {
            select: {
              members: true,
              inventoryItems: true,
              inventoryUnits: true,
              storageLocations: true,
            },
          },
        },
      },
    },
  });

  if (!membership || membership.workspace.isArchived) {
    throw new NotFoundError('Workspace not found or access denied', 'WORKSPACE_NOT_FOUND');
  }

  return {
    ...membership.workspace,
    currentUserRole: membership.role,
  };
}

export async function updateWorkspace(
  workspaceId: string,
  userId: string,
  input: UpdateWorkspaceInput
) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.isArchived) {
    throw new NotFoundError('Workspace not found', 'WORKSPACE_NOT_FOUND');
  }

  const updated = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      name: input.name,
      description: input.description,
      icon: input.icon,
      settings: input.settings ? (input.settings as Prisma.InputJsonValue) : undefined,
    },
  });

  return updated;
}

export async function archiveWorkspace(workspaceId: string, userId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (workspace.ownerId !== userId) {
    throw new ForbiddenError('Only the workspace owner can archive the workspace', 'NOT_WORKSPACE_OWNER');
  }

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { isArchived: true },
  });
}

export async function deleteWorkspace(workspaceId: string, userId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  if (workspace.ownerId !== userId) {
    throw new ForbiddenError('Only the workspace owner can delete the workspace', 'NOT_WORKSPACE_OWNER');
  }

  await prisma.workspace.delete({
    where: { id: workspaceId },
  });
}
