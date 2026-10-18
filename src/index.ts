import { buildApp } from './app/index.js';
import { config } from './config/index.js';
import { prisma } from './database/client.js';

async function start() {
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}. Shutting down gracefully...`);
    try {
      await app.close();
      await prisma.$disconnect();
      app.log.info('Server and database disconnected cleanly.');
      process.exit(0);
    } catch (err) {
      app.log.error(err, 'Error during graceful shutdown');
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  try {
    const address = await app.listen({
      port: config.PORT,
      host: config.HOST,
    });
    console.log(`AGF Drawer backend running on ${address}`);
    console.log(`OpenAPI documentation available at ${address}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
