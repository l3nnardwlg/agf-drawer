import fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ZodError } from 'zod';

import { config } from '../config/index.js';
import { AppError } from '../types/errors.js';
import { parseSession } from '../middleware/auth.js';

import { authRoutes } from '../modules/auth/routes.js';
import { userRoutes } from '../modules/users/routes.js';
import { workspaceRoutes } from '../modules/workspaces/routes.js';
import { memberRoutes } from '../modules/members/routes.js';
import { storageRoutes } from '../modules/storage/routes.js';
import { connectorRoutes } from '../modules/connectors/routes.js';
import { inventoryRoutes } from '../modules/inventory/routes.js';
import { unitRoutes } from '../modules/units/routes.js';
import { assignmentRoutes } from '../modules/assignments/routes.js';
import { movementRoutes } from '../modules/movements/routes.js';
import { searchRoutes } from '../modules/search/routes.js';
import { statsRoutes } from '../modules/stats/routes.js';
import { legacyAdapterRoutes } from './legacy-adapter.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      level: config.NODE_ENV === 'test' ? 'silent' : 'info',
      redact: ['req.headers.authorization', 'req.headers.cookie', 'body.password', 'body.newPassword'],
    },
    bodyLimit: 1048576, // 1MB body limit
  });

  // CORS
  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return cb(null, true);
      const allowedOrigins = config.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return cb(null, true);
      }
      return cb(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Workspace-Id', 'X-CSRF-Token'],
  });

  // Helmet Security Headers
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false, // Allows frontend script execution in public/
  });

  // Cookies
  await app.register(fastifyCookie, {
    secret: config.COOKIE_SECRET,
  });

  // Rate Limiting
  await app.register(fastifyRateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW_MS,
    allowList: config.NODE_ENV === 'test' ? ['127.0.0.1'] : [],
  });

  // OpenAPI 3.1 Documentation
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'AGF Drawer API',
        description:
          'Industrial inventory and asset management platform API by AGF Studios. Supports cables, connectors, electronic components, hierarchical storage, multi-tenancy, and physical unit tracking.',
        version: '1.0.0',
      },
      servers: [
        {
          url: '/api/v1',
          description: 'Current Version',
        },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'drawer_session',
          },
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'Token',
          },
        },
      },
      security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  // Serve static public folder for frontend
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  let publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    publicDir = path.resolve(currentDir, currentDir.includes('dist') ? '../../../public' : '../../public');
  }
  if (fs.existsSync(publicDir)) {
    await app.register(fastifyStatic, {
      root: publicDir,
      prefix: '/',
    });
  }

  // Global Session Parser
  app.addHook('preHandler', parseSession);

  // Healthcheck endpoint
  app.get('/health', async () => {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  });

  // Mount API v1 modules
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(userRoutes, { prefix: '/api/v1' });
  app.register(workspaceRoutes, { prefix: '/api/v1/workspaces' });
  app.register(memberRoutes, { prefix: '/api/v1' });
  app.register(storageRoutes, { prefix: '/api/v1/storage/locations' });
  app.register(connectorRoutes, { prefix: '/api/v1/connectors' });
  app.register(inventoryRoutes, { prefix: '/api/v1/inventory' });
  app.register(inventoryRoutes, { prefix: '/api/v1' }); // Mounts /api/v1/cables as well
  app.register(unitRoutes, { prefix: '/api/v1/units' });
  app.register(assignmentRoutes, { prefix: '/api/v1/assignments' });
  app.register(movementRoutes, { prefix: '/api/v1/movements' });
  app.register(searchRoutes, { prefix: '/api/v1/search' });
  app.register(statsRoutes, { prefix: '/api/v1/stats' });

  // Mount legacy adapter routes for existing MVP frontend
  app.register(legacyAdapterRoutes, { prefix: '/api' });

  // Standardized Error Handler
  app.setErrorHandler((error: any, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: {
          code: 'INVALID_REQUEST_DATA',
          message: 'Request validation failed',
          details: error.flatten().fieldErrors,
        },
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });
    }

    // Fastify schema validation error
    if (error.validation) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      });
    }

    if (error.statusCode === 429) {
      return reply.status(429).send({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later',
        },
      });
    }

    request.log.error(error);

    return reply.status(error.statusCode || 500).send({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message:
          config.NODE_ENV === 'production'
            ? 'An unexpected internal error occurred'
            : error.message || 'Internal error',
      },
    });
  });

  return app;
}
