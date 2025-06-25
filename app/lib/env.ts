import { z } from 'zod/v4';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  APPLICATION_SECRET: z.string(),
});

function parseEnv() {
  const parseResult = envSchema.safeParse(process.env);
  if (!parseResult.success) {
    console.error('Environment variables validation failed:', parseResult.error);
    process.exit(1);
  }
  return parseResult.data;
}

export const env = parseEnv();
