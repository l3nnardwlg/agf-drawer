import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app/index.js';
import { prisma } from '../src/database/client.js';

describe('Cables, Connectors & Symmetrical Search', () => {
  let app: FastifyInstance;
  let token: string;
  let workspaceId: string;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        username: `cable_user_${Date.now()}`,
        email: `cable_${Date.now()}@example.com`,
        password: 'Password123!',
        displayName: 'Cable Test User',
      },
    });
    const data = JSON.parse(res.body);
    token = data.token;
    workspaceId = data.primaryWorkspaceId;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  let cable1Id: string;
  let cable2Id: string;

  it('creates cable specifications with independent endpoints and physical units', async () => {
    // Cable 1: USB-C to USB-A (150cm, Grey)
    const res1 = await app.inject({
      method: 'POST',
      url: '/api/v1/cables',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        name: 'USB-C to USB-A SuperSpeed Cable',
        connectorA: 'USB-C',
        connectorB: 'USB-A',
        color: 'Grey',
        lengthCm: 150,
        cableStandard: 'USB 3.2 Gen 1',
        manufacturer: 'Anker',
        quantity: 3,
        notes: 'Durable nylon braided',
        tags: ['fast-charging', 'braided'],
      },
    });

    expect(res1.statusCode).toBe(201);
    const body1 = JSON.parse(res1.body);
    expect(body1.id).toBeDefined();
    expect(body1.summary.total).toBe(3);
    expect(body1.summary.stored).toBe(3);
    cable1Id = body1.id;

    // Cable 2: HDMI to Mini-HDMI (200cm, Black)
    const res2 = await app.inject({
      method: 'POST',
      url: '/api/v1/cables',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        name: 'High Speed Mini-HDMI to HDMI',
        connectorA: 'HDMI',
        connectorB: 'Mini-HDMI',
        color: 'Black',
        lengthCm: 200,
        manufacturer: 'CableMatters',
        quantity: 2,
      },
    });

    expect(res2.statusCode).toBe(201);
    cable2Id = JSON.parse(res2.body).id;
  });

  it('performs symmetrical connector matching (finding USB-C -> USB-A when searching USB-A -> USB-C)', async () => {
    // Search direction: USB-A and USB-C (inverted relative to creation)
    const resInverted = await app.inject({
      method: 'GET',
      url: '/api/v1/search?connectorA=USB-A&connectorB=USB-C',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });

    expect(resInverted.statusCode).toBe(200);
    const bodyInverted = JSON.parse(resInverted.body);
    expect(bodyInverted.total).toBe(1);
    expect(bodyInverted.items[0].id).toBe(cable1Id);

    // Search direction: USB-C and USB-A (same direction)
    const resSame = await app.inject({
      method: 'GET',
      url: '/api/v1/search?connectorA=USB-C&connectorB=USB-A',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });

    expect(resSame.statusCode).toBe(200);
    const bodySame = JSON.parse(resSame.body);
    expect(bodySame.total).toBe(1);
    expect(bodySame.items[0].id).toBe(cable1Id);
  });

  it('filters cables by length range and color', async () => {
    // Search length between 100cm and 180cm -> should match Cable 1 (150cm) but not Cable 2 (200cm)
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/search?minLength=100&maxLength=180&color=grey',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.total).toBe(1);
    expect(body.items[0].id).toBe(cable1Id);
  });

  it('lists connectors from catalog including seeded standard connectors', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/connectors',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
    });

    expect(res.statusCode).toBe(200);
    const connectors = JSON.parse(res.body);
    expect(connectors.length).toBeGreaterThan(30);

    const names = connectors.map((c: any) => c.name);
    expect(names).toContain('USB-C');
    expect(names).toContain('HDMI');
    expect(names).toContain('RJ45');
    expect(names).toContain('XLR');
    expect(names).toContain('Schuko');
  });

  it('allows creating custom connector for workspace', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/connectors',
      headers: {
        authorization: `Bearer ${token}`,
        'x-workspace-id': workspaceId,
      },
      payload: {
        name: 'LEMO 4-Pin Custom',
        family: 'OTHER',
        description: 'Special studio camera sync cable connector',
        aliases: ['LEMO-4', 'Sync LEMO'],
        protocols: ['Timecode', 'Genlock'],
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.name).toBe('LEMO 4-Pin Custom');
    expect(body.isCustom).toBe(true);
  });
});
