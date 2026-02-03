import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  DEFAULT_HOT_THRESHOLD: z.coerce.number().default(35),
  DEFAULT_COLD_THRESHOLD: z.coerce.number().default(22)
});

export const env = envSchema.parse(process.env);
