import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  emailVerificationSchema,
} from './schemas.js';
import * as authService from './service.js';
import { requireAuth, SESSION_COOKIE_NAME, CSRF_COOKIE_NAME } from '../../middleware/auth.js';
import { generateSecureToken } from '../../utils/crypto.js';
import { config } from '../../config/index.js';

export const authRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  // CSRF token retrieval endpoint
  app.get('/csrf', async (request, reply) => {
    let csrfToken = request.cookies[CSRF_COOKIE_NAME];
    if (!csrfToken) {
      csrfToken = generateSecureToken(24);
      reply.setCookie(CSRF_COOKIE_NAME, csrfToken, {
        path: '/',
        httpOnly: false, // Accessible by JavaScript client to send in X-CSRF-Token header
        sameSite: 'lax',
        secure: config.NODE_ENV === 'production',
      });
    }
    return { csrfToken };
  });

  // Registration
  app.post('/register', async (request, reply) => {
    const input = registerSchema.parse(request.body);
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    const result = await authService.registerUser(input, ipAddress, userAgent);

    reply.setCookie(SESSION_COOKIE_NAME, result.sessionToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: config.NODE_ENV === 'production',
      maxAge: config.SESSION_TTL_SECONDS,
    });

    const csrfToken = generateSecureToken(24);
    reply.setCookie(CSRF_COOKIE_NAME, csrfToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: config.NODE_ENV === 'production',
      maxAge: config.SESSION_TTL_SECONDS,
    });

    return reply.status(201).send({
      message: 'Registration successful',
      token: result.sessionToken,
      user: result.user,
      primaryWorkspaceId: result.primaryWorkspaceId,
    });
  });

  // Login
  app.post('/login', async (request, reply) => {
    const input = loginSchema.parse(request.body);
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'];

    const result = await authService.loginUser(input, ipAddress, userAgent);

    reply.setCookie(SESSION_COOKIE_NAME, result.sessionToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: config.NODE_ENV === 'production',
      maxAge: config.SESSION_TTL_SECONDS,
    });

    const csrfToken = generateSecureToken(24);
    reply.setCookie(CSRF_COOKIE_NAME, csrfToken, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: config.NODE_ENV === 'production',
      maxAge: config.SESSION_TTL_SECONDS,
    });

    return reply.send({
      message: 'Login successful',
      token: result.sessionToken,
      user: result.user,
      primaryWorkspaceId: result.primaryWorkspaceId,
    });
  });

  // Logout current session
  app.post('/logout', { preHandler: [requireAuth] }, async (request, reply) => {
    if (request.sessionToken) {
      await authService.logoutUser(request.sessionToken);
    }

    reply.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    reply.clearCookie(CSRF_COOKIE_NAME, { path: '/' });
    return reply.send({ message: 'Logged out successfully' });
  });

  // Logout from all devices
  app.post('/logout-all', { preHandler: [requireAuth] }, async (request, reply) => {
    await authService.logoutAllUserSessions(request.user!.id);
    reply.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    reply.clearCookie(CSRF_COOKIE_NAME, { path: '/' });
    return reply.send({ message: 'All active sessions have been revoked' });
  });

  // Change password
  app.post('/change-password', { preHandler: [requireAuth] }, async (request, reply) => {
    const input = changePasswordSchema.parse(request.body);
    await authService.changeUserPassword(request.user!.id, input, request.sessionToken);
    return reply.send({ message: 'Password changed successfully' });
  });

  // Request password reset
  app.post('/password-reset/request', async (request, reply) => {
    const input = passwordResetRequestSchema.parse(request.body);
    await authService.requestPasswordReset(input.email);
    return reply.send({
      message: 'If the email exists, a password reset token has been sent',
    });
  });

  // Confirm password reset
  app.post('/password-reset/confirm', async (request, reply) => {
    const input = passwordResetConfirmSchema.parse(request.body);
    await authService.confirmPasswordReset(input.token, input.newPassword);
    return reply.send({ message: 'Password has been reset successfully' });
  });

  // Verify email
  app.post('/verify-email', async (request, reply) => {
    const input = emailVerificationSchema.parse(request.body);
    await authService.confirmEmailVerification(input.token);
    return reply.send({ message: 'Email verified successfully' });
  });
};
