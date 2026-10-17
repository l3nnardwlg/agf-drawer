import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { LocationType } from '@prisma/client';
import { buildApp } from '../src/app/index.js';
import { prisma } from '../src/database/client.js';

describe('Storage Hierarchy & Cycle Prevention', () => {
  let app: FastifyInstance;
  let token: string;
  let workspaceId: string;

  let otherToken: string;
  let otherWorkspaceId: string;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    // User 1
    const res1 = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        username: `storage_user_${Date.now()}`,
        email: `storage_${Date.now()}@example.com`,
        password: 'Password123!',
        displayName: 'Storage Test User',
      },
    });
    const d1 = JSON.parse(res1.body);
    token = d1.token;
    workspaceId = d1.primaryWorkspaceId;

    // User 2 (for cross-workspace check)
    const res2 = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        username: `other_ws_${Date.now()}`,
        email: `other_${Date.now()}@example.com`,
        password: 'Password123!',
        displayName: 'Other WS User',
      },
    });
    const d2 = JSON.parse(res2.body);
    otherToken = d2.token;
    otherWorkspaceId = d2.primaryWorkspaceId;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  let roomLocationId: string;
  let cabinetLocationId: string;
  let drawerLocationId: string;

  it('creates nested storage locations (Room -> Cabinet -> Drawer)', async () => {
    // 1. Room
    const roomRes = await app.inject({
      method: 'POST',
      url: '/api/v1/storage/locations',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        name: 'Electronics Workshop',
        type: LocationType.ROOM,
      },
    });
    expect(roomRes.statusCode).toBe(201);
    roomLocationId = JSON.parse(roomRes.body).id;

    // 2. Cabinet under Room
    const cabRes = await app.inject({
      method: 'POST',
      url: '/api/v1/storage/locations',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        name: 'Cabinet A',
        type: LocationType.CABINET,
        parentId: roomLocationId,
      },
    });
    expect(cabRes.statusCode).toBe(201);
    cabinetLocationId = JSON.parse(cabRes.body).id;

    // 3. Drawer under Cabinet
    const drawerRes = await app.inject({
      method: 'POST',
      url: '/api/v1/storage/locations',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        name: 'Drawer 1 (USB Cables)',
        type: LocationType.DRAWER,
        parentId: cabinetLocationId,
      },
    });
    expect(drawerRes.statusCode).toBe(201);
    drawerLocationId = JSON.parse(drawerRes.body).id;
  });

  it('retrieves hierarchical storage tree with proper nesting', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/storage/locations/tree',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });

    expect(res.statusCode).toBe(200);
    const tree = JSON.parse(res.body);
    const room = tree.find((n: any) => n.id === roomLocationId);
    expect(room).toBeDefined();
    expect(room.children.length).toBe(1);
    expect(room.children[0].id).toBe(cabinetLocationId);
    expect(room.children[0].children[0].id).toBe(drawerLocationId);
  });

  it('detects and prevents circular hierarchy relationships', async () => {
    // Attempt to make Room a child of Drawer (which is a descendant of Room!)
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/storage/locations/${roomLocationId}`,
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        parentId: drawerLocationId,
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('CIRCULAR_HIERARCHY_DETECTED');
  });

  it('prevents cross-workspace parent assignment', async () => {
    // Create a location in other workspace
    const otherRes = await app.inject({
      method: 'POST',
      url: '/api/v1/storage/locations',
      headers: {
        authorization: `Bearer ${otherToken}`,
        'x-workspace-id': otherWorkspaceId,
      },
      payload: {
        name: 'Foreign Rack',
        type: LocationType.RACK,
      },
    });
    const foreignLocId = JSON.parse(otherRes.body).id;

    // Attempt to set foreign location as parent of local drawer
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/storage/locations/${drawerLocationId}`,
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        parentId: foreignLocId,
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('INVALID_PARENT_LOCATION');
  });

  it('prevents deleting a location that contains child locations', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/v1/storage/locations/${cabinetLocationId}`,
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('LOCATION_HAS_CHILDREN');
  });
});
