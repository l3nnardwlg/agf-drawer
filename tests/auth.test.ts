import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app/index.js';
import { prisma } from '../src/database/client.js';
import { verifyPassword } from '../src/utils/crypto.js';

describe('Authentication & User Management', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!',
    displayName: 'Test User',
  };

  let sessionToken: string;
  let userId: string;

  it('rejects registration with weak password', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        username: 'weakuser',
        email: 'weak@example.com',
        password: 'weak',
        displayName: 'Weak User',
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('INVALID_REQUEST_DATA');
  });

  it('registers a user successfully and sets httpOnly session cookie', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: testUser,
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.user.email).toBe(testUser.email.toLowerCase());
    expect(body.token).toBeDefined();
    sessionToken = body.token;
    userId = body.user.id;

    // Verify Argon2id password hashing in database
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    expect(dbUser?.passwordHash).toMatch(/^\$argon2id\$/);
    const isValid = await verifyPassword(dbUser!.passwordHash, testUser.password);
    expect(isValid).toBe(true);

    // Verify default workspace creation
    expect(body.primaryWorkspaceId).toBeDefined();
  });

  it('prevents duplicate email registration', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        ...testUser,
        username: `diff_${Date.now()}`,
      },
    });

    expect(res.statusCode).toBe(409);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('authenticates user with valid credentials', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        login: testUser.email,
        password: testUser.password,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.token).toBeDefined();
    expect(body.user.id).toBe(userId);
  });

  it('rejects invalid login credentials without enumeration leak', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        login: 'nonexistent@example.com',
        password: 'WrongPassword123!',
      },
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('retrieves current authenticated user profile (/api/v1/me)', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/me',
      headers: {
        authorization: `Bearer ${sessionToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.id).toBe(userId);
    expect(body.email).toBe(testUser.email.toLowerCase());
    expect(body.workspaces.length).toBeGreaterThan(0);
  });

  it('updates user preferences successfully', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/v1/me/preferences',
      headers: {
        authorization: `Bearer ${sessionToken}`,
      },
      payload: {
        preferredTheme: 'light',
        preferredLanguage: 'de',
        timezone: 'Europe/Berlin',
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.preferredTheme).toBe('light');
    expect(body.preferredLanguage).toBe('de');
    expect(body.timezone).toBe('Europe/Berlin');
  });

  it('lists active user sessions and allows revoking a session', async () => {
    // List sessions
    const listRes = await app.inject({
      method: 'GET',
      url: '/api/v1/me/sessions',
      headers: {
        authorization: `Bearer ${sessionToken}`,
      },
    });

    expect(listRes.statusCode).toBe(200);
    const sessions = JSON.parse(listRes.body);
    expect(sessions.length).toBeGreaterThan(0);

    const sessionId = sessions[0].id;

    // Revoke session
    const revokeRes = await app.inject({
      method: 'DELETE',
      url: `/api/v1/me/sessions/${sessionId}`,
      headers: {
        authorization: `Bearer ${sessionToken}`,
      },
    });

    expect(revokeRes.statusCode).toBe(200);

    // Verify session was removed from database
    const dbSession = await prisma.session.findUnique({ where: { id: sessionId } });
    expect(dbSession).toBeNull();
  });
});
