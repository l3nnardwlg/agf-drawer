import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SESSION_SECRET: z.string().min(16).default('development-session-secret-must-be-long-enough'),
  CSRF_SECRET: z.string().min(16).default('development-csrf-secret-must-be-long-enough'),
  COOKIE_SECRET: z.string().min(16).default('development-cookie-secret-must-be-long-enough'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  SESSION_TTL_SECONDS: z.coerce.number().default(604800), // 7 days
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default('AGF Drawer <noreply@agf-studios.com>'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  throw new Error('Environment configuration error');
}

export const config = parsed.data;
export type Config = z.infer<typeof envSchema>;
