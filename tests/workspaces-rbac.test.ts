import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { Role } from '@prisma/client';
import { buildApp } from '../src/app/index.js';
import { prisma } from '../src/database/client.js';

describe('Workspaces, Multi-Tenancy & RBAC Enforcement', () => {
  let app: FastifyInstance;

  let ownerToken: string;
  let ownerId: string;
  let workspace1Id: string;

  let userBToken: string;
  let userBId: string;
  let workspace2Id: string;

  let invitedUserToken: string;
  let invitedUserId: string;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    // Register User A (Owner of Workspace 1)
    const resA = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        username: `owner_${Date.now()}`,
        email: `owner_${Date.now()}@example.com`,
        password: 'Password123!',
        displayName: 'Owner User',
        workspaceName: 'AGF Main Studio',
      },
    });
    const dataA = JSON.parse(resA.body);
    ownerToken = dataA.token;
    ownerId = dataA.user.id;
    workspace1Id = dataA.primaryWorkspaceId;

    // Register User B (Owner of Workspace 2 - separate tenant)
    const resB = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        username: `userb_${Date.now()}`,
        email: `userb_${Date.now()}@example.com`,
        password: 'Password123!',
        displayName: 'User B',
        workspaceName: 'Homelab Pommernstube',
      },
    });
    const dataB = JSON.parse(resB.body);
    userBToken = dataB.token;
    userBId = dataB.user.id;
    workspace2Id = dataB.primaryWorkspaceId;

    // Register Invited User
    const resC = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        username: `invited_${Date.now()}`,
        email: `invited_${Date.now()}@example.com`,
        password: 'Password123!',
        displayName: 'Invited User',
      },
    });
    const dataC = JSON.parse(resC.body);
    invitedUserToken = dataC.token;
    invitedUserId = dataC.user.id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('verifies owner membership and role in created workspace', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/workspaces/${workspace1Id}`,
      headers: {
        authorization: `Bearer ${ownerToken}`,
        'x-workspace-id': workspace1Id,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.name).toBe('AGF Main Studio');
    expect(body.currentUserRole).toBe(Role.OWNER);
  });

  it('strictly isolates tenant data: User B cannot access Workspace 1', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/workspaces/${workspace1Id}`,
      headers: {
        authorization: `Bearer ${userBToken}`,
        'x-workspace-id': workspace1Id,
      },
    });

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('WORKSPACE_ACCESS_DENIED');
  });

  it('allows owner to invite a member with VIEWER role', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/workspaces/${workspace1Id}/invitations`,
      headers: {
        authorization: `Bearer ${ownerToken}`,
        'x-workspace-id': workspace1Id,
      },
      payload: {
        email: `invited_test_${Date.now()}@example.com`,
        role: Role.VIEWER,
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.role).toBe(Role.VIEWER);
    expect(body.invitationToken).toBeDefined();

    // Invited user accepts invitation
    const acceptRes = await app.inject({
      method: 'POST',
      url: '/api/v1/invitations/accept',
      headers: {
        authorization: `Bearer ${invitedUserToken}`,
      },
      payload: {
        token: body.invitationToken,
      },
    });

    expect(acceptRes.statusCode).toBe(200);
    const acceptBody = JSON.parse(acceptRes.body);
    expect(acceptBody.workspaceId).toBe(workspace1Id);
    expect(acceptBody.role).toBe(Role.VIEWER);
  });

  it('enforces RBAC: VIEWER cannot create inventory items', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/cables',
      headers: {
        authorization: `Bearer ${invitedUserToken}`,
        'x-workspace-id': workspace1Id,
      },
      payload: {
        name: 'Unauthorized Cable',
        connectorA: 'USB-C',
        connectorB: 'USB-A',
      },
    });

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('INSUFFICIENT_PERMISSIONS');
  });

  it('promotes user to EDITOR and verifies write access', async () => {
    // Find member record for invited user
    const membersRes = await app.inject({
      method: 'GET',
      url: `/api/v1/workspaces/${workspace1Id}/members`,
      headers: {
        authorization: `Bearer ${ownerToken}`,
        'x-workspace-id': workspace1Id,
      },
    });
    const members = JSON.parse(membersRes.body);
    const targetMember = members.find((m: any) => m.userId === invitedUserId);
    expect(targetMember).toBeDefined();

    // Update role to EDITOR
    const updateRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/workspaces/${workspace1Id}/members/${targetMember.id}`,
      headers: {
        authorization: `Bearer ${ownerToken}`,
        'x-workspace-id': workspace1Id,
      },
      payload: {
        role: Role.EDITOR,
      },
    });

    expect(updateRes.statusCode).toBe(200);

    // Now EDITOR can create a cable
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/cables',
      headers: {
        authorization: `Bearer ${invitedUserToken}`,
        'x-workspace-id': workspace1Id,
      },
      payload: {
        name: 'Editor Cable 1',
        connectorA: 'USB-C',
        connectorB: 'USB-C',
        quantity: 1,
      },
    });

    expect(createRes.statusCode).toBe(201);
  });

  it('prevents privilege escalation: non-owner cannot assign OWNER role', async () => {
    const membersRes = await app.inject({
      method: 'GET',
      url: `/api/v1/workspaces/${workspace1Id}/members`,
      headers: {
        authorization: `Bearer ${ownerToken}`,
        'x-workspace-id': workspace1Id,
      },
    });
    const members = JSON.parse(membersRes.body);
    const targetMember = members.find((m: any) => m.userId === invitedUserId);

    const updateRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/workspaces/${workspace1Id}/members/${targetMember.id}`,
      headers: {
        authorization: `Bearer ${invitedUserToken}`,
        'x-workspace-id': workspace1Id,
      },
      payload: {
        role: Role.ADMIN,
      },
    });

    expect(updateRes.statusCode).toBe(403);
  });

  it('prevents the last workspace owner from leaving without transferring ownership', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/workspaces/${workspace1Id}/leave`,
      headers: {
        authorization: `Bearer ${ownerToken}`,
        'x-workspace-id': workspace1Id,
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('LAST_OWNER_CANNOT_LEAVE');
  });
});
