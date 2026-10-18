import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app/index.js';
import { prisma } from '../src/database/client.js';

describe('Legacy API Compatibility Adapter', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  let locationId: string;
  let cableId: string;

  it('handles GET and POST /api/locations matching legacy frontend expectations', async () => {
    const postRes = await app.inject({
      method: 'POST',
      url: '/api/locations',
      payload: {
        name: 'Legacy Cabinet X',
        kind: 'cabinet',
      },
    });

    expect(postRes.statusCode).toBe(201);
    const postData = JSON.parse(postRes.body);
    expect(postData.id).toBeDefined();
    locationId = postData.id;

    const getRes = await app.inject({
      method: 'GET',
      url: '/api/locations',
    });

    expect(getRes.statusCode).toBe(200);
    const locations = JSON.parse(getRes.body);
    expect(Array.isArray(locations)).toBe(true);
    const created = locations.find((l: any) => l.id === locationId);
    expect(created).toBeDefined();
    expect(created.name).toBe('Legacy Cabinet X');
    expect(created.kind).toBe('cabinet');
  });

  it('handles POST and GET /api/cables matching legacy frontend contracts', async () => {
    const postRes = await app.inject({
      method: 'POST',
      url: '/api/cables',
      payload: {
        name: 'DisplayPort 1.4 Cable 2m',
        connector_a: 'DisplayPort',
        connector_b: 'DisplayPort',
        color: 'Black',
        length_cm: 200,
        notes: 'VESA certified',
        quantity: 2,
        location_id: locationId,
        status: 'stored',
      },
    });

    expect(postRes.statusCode).toBe(201);
    const postData = JSON.parse(postRes.body);
    expect(postData.id).toBeDefined();
    cableId = postData.id;

    // GET /api/cables
    const listRes = await app.inject({
      method: 'GET',
      url: '/api/cables?q=DisplayPort',
    });

    expect(listRes.statusCode).toBe(200);
    const cables = JSON.parse(listRes.body);
    expect(cables.length).toBeGreaterThan(0);
    const target = cables.find((c: any) => c.id === cableId);
    expect(target).toBeDefined();
    expect(target.connector_a).toBe('DisplayPort');
    expect(target.connector_b).toBe('DisplayPort');
    expect(target.total).toBe(2);
    expect(target.stored).toBe(2);

    // GET /api/cables/:id
    const singleRes = await app.inject({
      method: 'GET',
      url: `/api/cables/${cableId}`,
    });

    expect(singleRes.statusCode).toBe(200);
    const single = JSON.parse(singleRes.body);
    expect(single.id).toBe(cableId);
    expect(single.units.length).toBe(2);
  });

  it('handles PATCH /api/units/:id and POST /api/cables/:id/units', async () => {
    // Fetch units
    const cableRes = await app.inject({
      method: 'GET',
      url: `/api/cables/${cableId}`,
    });
    const cable = JSON.parse(cableRes.body);
    const unitId = cable.units[0].id;

    // PATCH /api/units/:id
    const patchRes = await app.inject({
      method: 'PATCH',
      url: `/api/units/${unitId}`,
      payload: {
        status: 'in_use',
        usage_place: 'Monitor 1 Desk',
      },
    });

    expect(patchRes.statusCode).toBe(200);
    expect(JSON.parse(patchRes.body).ok).toBe(true);

    // POST /api/cables/:id/units (add exemplar)
    const addUnitRes = await app.inject({
      method: 'POST',
      url: `/api/cables/${cableId}/units`,
      payload: {
        location_id: locationId,
      },
    });

    expect(addUnitRes.statusCode).toBe(201);
    expect(JSON.parse(addUnitRes.body).id).toBeDefined();
  });
});
