import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { UnitStatus, MovementAction } from '@prisma/client';
import { buildApp } from '../src/app/index.js';
import { prisma } from '../src/database/client.js';

describe('Physical Units, Usage Assignments & Movement History', () => {
  let app: FastifyInstance;
  let token: string;
  let workspaceId: string;
  let locationId: string;
  let cableId: string;
  let unit1Id: string;
  let unit2Id: string;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        username: `movement_user_${Date.now()}`,
        email: `movement_${Date.now()}@example.com`,
        password: 'Password123!',
        displayName: 'Movement Test User',
      },
    });
    const data = JSON.parse(res.body);
    token = data.token;
    workspaceId = data.primaryWorkspaceId;

    // Create a storage location
    const locRes = await app.inject({
      method: 'POST',
      url: '/api/v1/storage/locations',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        name: 'Drawer 42',
        type: 'DRAWER',
      },
    });
    locationId = JSON.parse(locRes.body).id;

    // Create cable with 2 units stored in Drawer 42
    const cableRes = await app.inject({
      method: 'POST',
      url: '/api/v1/cables',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        name: 'Cat6a Patch Cable Blue 1m',
        connectorA: 'RJ45',
        connectorB: 'RJ45',
        color: 'Blue',
        lengthCm: 100,
        quantity: 2,
        locationId,
        status: UnitStatus.STORED,
      },
    });

    const cableData = JSON.parse(cableRes.body);
    cableId = cableData.id;
    unit1Id = cableData.units[0].id;
    unit2Id = cableData.units[1].id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('assigns a physical cable unit to a usage location and enforces availability invariant', async () => {
    const assignRes = await app.inject({
      method: 'POST',
      url: '/api/v1/assignments/assign',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        unitId: unit1Id,
        usageLocation: 'Network Rack A, Switch Port 12',
        assignedDevice: 'Cisco Catalyst 3850',
        purpose: 'Uplink to Core Router',
      },
    });

    expect(assignRes.statusCode).toBe(201);
    const assignBody = JSON.parse(assignRes.body);
    expect(assignBody.unit.status).toBe(UnitStatus.IN_USE);
    expect(assignBody.unit.storageLocationId).toBeNull();
    expect(assignBody.unit.usageLocation).toBe('Network Rack A, Switch Port 12');

    // Verify cable availability counts
    const cableRes = await app.inject({
      method: 'GET',
      url: `/api/v1/cables/${cableId}`,
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });

    const cable = JSON.parse(cableRes.body);
    expect(cable.summary.total).toBe(2); // Total owned remains 2
    expect(cable.summary.stored).toBe(1); // Only 1 immediately available in storage!
    expect(cable.summary.in_use).toBe(1); // 1 is in active usage
  });

  it('prevents assigning a cable that is already in use', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/assignments/assign',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        unitId: unit1Id,
        usageLocation: 'Different Rack',
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('UNIT_NOT_AVAILABLE');
  });

  it('returns the cable to a storage location and restores available count', async () => {
    const returnRes = await app.inject({
      method: 'POST',
      url: '/api/v1/assignments/return',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        unitId: unit1Id,
        storageLocationId: locationId,
        notes: 'Returned after network reconfiguration',
      },
    });

    expect(returnRes.statusCode).toBe(200);
    const unit = JSON.parse(returnRes.body);
    expect(unit.status).toBe(UnitStatus.STORED);
    expect(unit.storageLocationId).toBe(locationId);
    expect(unit.usageLocation).toBeNull();

    // Verify counts
    const cableRes = await app.inject({
      method: 'GET',
      url: `/api/v1/cables/${cableId}`,
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });

    const cable = JSON.parse(cableRes.body);
    expect(cable.summary.total).toBe(2);
    expect(cable.summary.stored).toBe(2);
    expect(cable.summary.in_use).toBe(0);
  });

  it('enforces optimistic concurrency control on unit updates', async () => {
    // Get current unit version
    const unitRes = await app.inject({
      method: 'GET',
      url: `/api/v1/units/${unit2Id}`,
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });
    const currentUnit = JSON.parse(unitRes.body);
    const currentVersion = currentUnit.version;

    // Simulate conflict: provide stale expectedVersion
    const conflictRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/units/${unit2Id}`,
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        notes: 'Concurrent update test',
        expectedVersion: currentVersion - 1, // Stale version!
      },
    });

    expect(conflictRes.statusCode).toBe(409);
    const conflictBody = JSON.parse(conflictRes.body);
    expect(conflictBody.error.code).toBe('CONCURRENCY_CONFLICT');
  });

  it('verifies append-only transactional movement records in audit trail', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/movements?itemId=${cableId}`,
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.total).toBeGreaterThanOrEqual(3);

    const actions = body.items.map((m: any) => m.action);
    expect(actions).toContain(MovementAction.ITEM_CREATED);
    expect(actions).toContain(MovementAction.UNIT_ASSIGNED);
    expect(actions).toContain(MovementAction.UNIT_RETURNED);
  });
});
